import { TestBed } from '@angular/core/testing';
import { HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { GameHubService } from '../realtime/game-hub.service';
import { RealtimeEnvelope } from '../realtime/realtime-envelope';
import { GameFacade } from './game-facade.service';

describe('GameFacade', () => {
  let facade: GameFacade;
  let hub: FakeGameHub;

  beforeEach(() => {
    sessionStorage.clear();
    hub = new FakeGameHub();
    TestBed.configureTestingModule({ providers: [{ provide: GameHubService, useValue: hub }] });
    facade = TestBed.inject(GameFacade);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('starts at home with no players', () => {
    expect(facade.phase()).toBe('home');
    expect(facade.playerCount()).toBe(0);
  });

  it('projects a real game-state as a 6x6 board', () => {
    hub.emitState({
      status: 'inprogress',
      players: [{ playerId: 'ana', name: 'Ana', color: 'red', row: 0, column: 0, points: 1, isReady: true, isCurrentPlayer: true }],
      currentPlayerId: 'ana', activeSymbolId: 'Symbol01', remainingSteps: 3, winnerPlayerId: null,
      walls: [], symbols: { Symbol01: { row: 1, column: 1 } },
    });

    expect(facade.phase()).toBe('playing');
    expect(facade.board().size).toBe(6);
    expect(facade.board().pieces).toHaveLength(1);
    expect(facade.dice().value).toBe(3);
    expect(facade.objective()).toMatchObject({ label: 'Sol', visual: '☀' });
    expect(facade.board().cells[0]).toMatchObject({ symbol: '☀', label: 'Sol' });
  });

  it('stores the player session sent by the server', () => {
    hub.events.next({ type: 'player-session', payload: { playerId: 'ana' }, occurredAt: '2026-07-22T00:00:00Z' });
    hub.emitState({ status: 'lobby', players: [{ playerId: 'ana', name: 'Ana', color: 'red', row: 0, column: 0, points: 0, isReady: false, isCurrentPlayer: false }], currentPlayerId: null, activeSymbolId: null, remainingSteps: 0, winnerPlayerId: null, walls: [], symbols: {} });

    expect(facade.playerName()).toBe('Ana');
    expect(facade.isLocalHost()).toBe(true);
  });

  it('keeps toast lifecycle inside the facade', () => {
    vi.useFakeTimers();
    try {
      facade.notify('success', 'Listo');
      expect(facade.toasts()).toHaveLength(1);
      vi.runAllTimers();
      expect(facade.toasts()).toHaveLength(0);
    } finally { vi.useRealTimers(); }
  });

  it('does not report a rejected realtime command as successful', async () => {
    hub.dispatch.mockResolvedValueOnce({
      envelopes: [{ type: 'action-rejected', payload: { message: 'No es tu turno.' }, occurredAt: '2026-07-22T00:00:00Z' }],
    });

    await expect(facade.startGame()).resolves.toBe(false);
    expect(facade.toasts()).toContainEqual(expect.objectContaining({ kind: 'error', text: 'No es tu turno.' }));
  });
});

class FakeGameHub {
  readonly events = new Subject<RealtimeEnvelope>();
  readonly errors = new Subject<Error>();
  readonly connectionState = new BehaviorSubject(HubConnectionState.Disconnected);
  readonly events$ = this.events.asObservable();
  readonly errors$ = this.errors.asObservable();
  readonly connectionState$ = this.connectionState.asObservable();
  readonly connect = vi.fn(async () => { this.connectionState.next(HubConnectionState.Connected); });
  readonly getState = vi.fn(async () => undefined);
  readonly dispatch = vi.fn(async (): Promise<{ envelopes: readonly RealtimeEnvelope[] }> => ({ envelopes: [] }));

  emitState(payload: unknown): void { this.events.next({ type: 'game-state', payload, occurredAt: '2026-07-22T00:00:00Z' }); }
}
