import { TestBed } from '@angular/core/testing';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import {
  GAME_HUB_CONNECTION_FACTORY,
  GAME_REALTIME_CONFIG,
  GameHubConnectionFactory,
} from './game-realtime.config';
import { GameHubService } from './game-hub.service';

describe('GameHubService', () => {
  let connection: FakeHubConnection;
  let service: GameHubService;

  beforeEach(() => {
    connection = new FakeHubConnection();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: GAME_REALTIME_CONFIG,
          useValue: {
            hubUrl: 'http://localhost:5291/hubs/game',
            reconnectDelaysMs: [0, 1_000, 3_000],
          },
        },
        {
          provide: GAME_HUB_CONNECTION_FACTORY,
          useValue: (() => connection as unknown as HubConnection) as GameHubConnectionFactory,
        },
      ],
    });

    service = TestBed.inject(GameHubService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('starts only one connection when connect is called concurrently', async () => {
    await Promise.all([service.connect(), service.connect()]);

    expect(connection.start).toHaveBeenCalledTimes(1);
  });

  it('invokes the generic hub methods only after connecting', async () => {
    await service.connect();
    await service.getState();
    await service.dispatch({ name: 'test-command', payload: { value: 1 } });

    expect(connection.invoke).toHaveBeenNthCalledWith(1, 'GetState');
    expect(connection.invoke).toHaveBeenNthCalledWith(2, 'Dispatch', {
      name: 'test-command',
      payload: { value: 1 },
    });
  });

  it('publishes only valid game-event envelopes', async () => {
    const received = vi.fn();
    const errors = vi.fn();
    const subscription = service.events$.subscribe(received);
    const errorSubscription = service.errors$.subscribe(errors);

    await service.connect();
    connection.emit('game-event', {
      type: 'state',
      payload: { gameId: 'demo' },
      occurredAt: '2026-07-22T00:00:00Z',
    });
    connection.emit('game-event', { type: 'state' });

    expect(received).toHaveBeenCalledTimes(1);
    expect(errors).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
    errorSubscription.unsubscribe();
  });

  it('stops and detaches the game-event listener when disconnecting', async () => {
    await service.connect();
    await service.disconnect();

    expect(connection.off).toHaveBeenCalledWith('game-event', expect.any(Function));
    expect(connection.stop).toHaveBeenCalledTimes(1);
  });
});

class FakeHubConnection {
  state = HubConnectionState.Disconnected;
  readonly start = vi.fn(async (): Promise<void> => {
    this.state = HubConnectionState.Connected;
  });
  readonly stop = vi.fn(async (): Promise<void> => {
    this.state = HubConnectionState.Disconnected;
  });
  readonly invoke = vi.fn(async (..._arguments: unknown[]): Promise<void> => undefined);
  readonly on = vi.fn((eventName: string, handler: (payload: unknown) => void): void => {
    this.eventHandlers.set(eventName, handler);
  });
  readonly off = vi.fn((eventName: string): void => {
    this.eventHandlers.delete(eventName);
  });
  readonly onreconnecting = vi.fn();
  readonly onreconnected = vi.fn();
  readonly onclose = vi.fn();

  private readonly eventHandlers = new Map<string, (payload: unknown) => void>();

  emit(eventName: string, payload: unknown): void {
    this.eventHandlers.get(eventName)?.(payload);
  }
}
