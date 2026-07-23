import { Injectable, computed, inject, signal } from '@angular/core';
import { HubConnectionState } from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { GameHubService } from '../realtime/game-hub.service';
import { BoardPosition, BoardVisualState, PieceVisual, TileVisual, WallVisual } from '../../features/game/board/models';
import { DiceVisual, GameActionVisual, PlayerStatusVisual, TreasureVisual, TurnVisual } from '../../features/game/hud/models';
import { LobbyPlayer } from '../../features/lobby/models';
import { ConnectionStatus, GamePhase, GameSummaryEntry, PlayerMode, ToastKind, ToastMessage, WallNotice } from './facade-models';

interface HubPlayer {
  readonly playerId: string;
  readonly name: string;
  readonly color: string | null;
  readonly row: number;
  readonly column: number;
  readonly points: number;
  readonly isReady: boolean;
  readonly isCurrentPlayer: boolean;
}

interface HubWall { readonly fromRow: number; readonly fromColumn: number; readonly toRow: number; readonly toColumn: number; }
interface HubState {
  readonly status: 'none' | 'lobby' | 'inprogress' | 'finished';
  readonly players: readonly HubPlayer[];
  readonly currentPlayerId: string | null;
  readonly activeSymbolId: string | null;
  readonly remainingSteps: number;
  readonly winnerPlayerId: string | null;
  readonly walls: readonly HubWall[];
  readonly symbols: Readonly<Record<string, { readonly row: number; readonly column: number }>>;
}

const BOARD_SIZE = 6;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const TOAST_DURATION_MS = 4500;
const SESSION_PLAYER_KEY = 'laberinto.player-id';

/**
 * Único adaptador entre las pantallas y SignalR. Los componentes visuales no
 * conocen el transporte ni las reglas: solo consumen los modelos derivados de
 * las señales de esta fachada.
 */
@Injectable({ providedIn: 'root' })
export class GameFacade {
  private readonly hub = inject(GameHubService);
  private readonly stateSignal = signal<HubState>(emptyState());
  private readonly modeSignal = signal<PlayerMode>('player');
  private readonly playerIdSignal = signal<string | null>(sessionStorage.getItem(SESSION_PLAYER_KEY));
  private readonly connectionSignal = signal<ConnectionStatus>('disconnected');
  private readonly loadingSignal = signal<string | null>(null);
  private readonly toastsSignal = signal<readonly ToastMessage[]>([]);
  private readonly selectedTileSignal = signal<BoardPosition | undefined>(undefined);
  private readonly revealedWallsSignal = signal<readonly WallVisual[]>([]);
  private readonly wallNoticeSignal = signal<WallNotice | null>(null);
  private toastSequence = 0;
  private wallTimer: ReturnType<typeof setTimeout> | undefined;
  private restoring?: Promise<void>;
  private readonly subscriptions: Subscription[];

  readonly playerColors = [
    { name: 'Red', label: 'Rojo', value: '#ef5b5b' },
    { name: 'Blue', label: 'Azul', value: '#4db7ff' },
    { name: 'Green', label: 'Verde', value: '#4ee29a' },
    { name: 'Yellow', label: 'Amarillo', value: '#f5c451' },
  ] as const;
  readonly minPlayers = MIN_PLAYERS;
  readonly maxPlayers = MAX_PLAYERS;

  readonly phase = computed<GamePhase>(() => phaseFor(this.stateSignal().status));
  readonly mode = this.modeSignal.asReadonly();
  readonly connectionStatus = this.connectionSignal.asReadonly();
  readonly loadingMessage = this.loadingSignal.asReadonly();
  readonly toasts = this.toastsSignal.asReadonly();
  readonly playerName = computed(() => this.localPlayer()?.name ?? '');
  readonly wallNotice = this.wallNoticeSignal.asReadonly();
  readonly isLoading = computed(() => this.loadingSignal() !== null);
  readonly isSpectator = computed(() => this.modeSignal() === 'spectator');
  readonly localPlayer = computed(() => this.stateSignal().players.find((player) => player.playerId === this.playerIdSignal()) ?? null);
  readonly playerCount = computed(() => this.stateSignal().players.length);
  readonly isLocalReady = computed(() => this.localPlayer()?.isReady ?? false);
  readonly isLocalHost = computed(() => this.stateSignal().players[0]?.playerId === this.playerIdSignal());
  readonly canStartGame = computed(() => this.playerCount() >= MIN_PLAYERS && this.stateSignal().players.every((player) => player.isReady));
  readonly isMyTurn = computed(() => !this.isSpectator() && this.stateSignal().currentPlayerId === this.playerIdSignal());

  readonly lobbyPlayers = computed<readonly LobbyPlayer[]>(() => this.stateSignal().players.map((player, index) => ({
    id: player.playerId,
    name: player.name,
    color: colorFor(player.color),
    isHost: index === 0,
    isReady: player.isReady,
    isCurrentTurn: player.isCurrentPlayer,
  })));

  readonly playerStatuses = computed<readonly PlayerStatusVisual[]>(() => this.stateSignal().players.map((player) => ({
    id: player.playerId,
    name: player.playerId === this.playerIdSignal() ? `${player.name} (vos)` : player.name,
    color: colorFor(player.color),
    points: player.points,
    isActive: player.isCurrentPlayer,
    isConnected: true,
  })));

  readonly turn = computed<TurnVisual | null>(() => {
    const active = this.stateSignal().players.find((player) => player.isCurrentPlayer);
    if (!active) return null;
    return {
      playerName: active.name,
      playerColor: colorFor(active.color),
      text: active.playerId === this.playerIdSignal() ? 'Es tu turno: lanzá el dado y movete.' : 'Esperando su jugada…',
    };
  });

  readonly dice = computed<DiceVisual>(() => ({
    value: this.stateSignal().remainingSteps || null,
    isAvailable: this.isMyTurn() && this.stateSignal().remainingSteps === 0,
  }));

  readonly objective = computed<TreasureVisual | null>(() => {
    const symbolId = this.stateSignal().activeSymbolId;
    return symbolId ? { id: symbolId, label: readableSymbol(symbolId), visual: '✦' } : null;
  });

  readonly board = computed<BoardVisualState>(() => {
    const state = this.stateSignal();
    const cells: TileVisual[] = Object.entries(state.symbols).map(([id, position]) => ({
      position,
      kind: 'objective',
      symbol: state.activeSymbolId === id ? '✦' : '◇',
      emphasized: state.activeSymbolId === id,
      label: readableSymbol(id),
    }));
    const pieces: PieceVisual[] = state.players.map((player) => ({
      id: player.playerId,
      color: colorFor(player.color),
      label: player.name,
      position: { row: player.row, column: player.column },
      isActive: player.isCurrentPlayer,
    }));
    return { size: BOARD_SIZE, cells, pieces, walls: this.revealedWallsSignal(), selection: this.selectedTileSignal() };
  });

  readonly actions = computed<readonly GameActionVisual[]>(() => [
    { id: 'move', label: 'Mover ficha', isDisabled: !this.isMyTurn() || this.stateSignal().remainingSteps === 0 || !this.selectedTileSignal() },
    { id: 'end-turn', label: 'Terminar turno', isDisabled: !this.isMyTurn() || this.stateSignal().remainingSteps === 0 },
    { id: 'leave', label: 'Abandonar partida' },
  ]);

  readonly summary = computed<readonly GameSummaryEntry[]>(() => this.stateSignal().players
    .slice().sort((left, right) => right.points - left.points)
    .map((player) => ({ playerName: player.name, color: colorFor(player.color), symbolsFound: player.points, isWinner: player.playerId === this.stateSignal().winnerPlayerId })));
  readonly winner = computed<GameSummaryEntry | null>(() => this.summary().find((entry) => entry.isWinner) ?? null);

  constructor() {
    this.subscriptions = [
      this.hub.events$.subscribe((event) => this.consume(event.type, event.payload)),
      this.hub.errors$.subscribe((error) => this.notify('error', error.message)),
      this.hub.connectionState$.subscribe((status) => {
        this.connectionSignal.set(connectionStatusFor(status));
        if (status === HubConnectionState.Connected) void this.restorePlayer();
      }),
    ];
  }

  async connect(): Promise<void> {
    await this.hub.connect();
    await this.restorePlayer();
    await this.hub.getState();
  }

  async createGame(playerName: string): Promise<boolean> {
    return this.command('create-game', { name: playerName }, 'Creando partida…');
  }

  async joinGame(playerName: string): Promise<boolean> {
    return this.command('join-game', { name: playerName }, 'Uniéndote a la partida…');
  }

  async spectate(): Promise<boolean> {
    this.modeSignal.set('spectator');
    await this.connect();
    return true;
  }

  async chooseColor(color: string): Promise<void> { await this.command('choose-color', { color }); }
  async markReady(): Promise<void> { await this.command('ready'); }
  async startGame(): Promise<boolean> { return this.command('start-game'); }
  async rollDice(): Promise<void> { await this.command('roll-dice'); }

  selectTile(position: BoardPosition): void {
    if (!this.isMyTurn() || this.stateSignal().remainingSteps === 0) return;
    const selected = this.selectedTileSignal();
    this.selectedTileSignal.set(selected?.row === position.row && selected.column === position.column ? undefined : position);
  }

  async performAction(actionId: string): Promise<void> {
    if (actionId === 'end-turn') { await this.command('end-turn'); return; }
    if (actionId !== 'move') return;
    const from = this.localPlayer();
    const target = this.selectedTileSignal();
    if (!from || !target) return;
    const direction = directionFrom({ row: from.row, column: from.column }, target);
    if (!direction) { this.notify('warning', 'Elegí una casilla vecina para avanzar un paso.'); return; }
    await this.command('move', { path: [direction] });
    this.selectedTileSignal.set(undefined);
  }

  async restartGame(): Promise<void> { await this.command('restart-game'); this.clearPlayerSession(); }
  async leaveGame(): Promise<void> { await this.command('leave-game'); this.clearPlayerSession(); this.reset(); }
  dismissWallNotice(): void { this.clearWallNotice(); }
  dismissToast(id: number): void { this.toastsSignal.update((items) => items.filter((item) => item.id !== id)); }
  notify(kind: ToastKind, text: string): void {
    const toast = { id: ++this.toastSequence, kind, text };
    this.toastsSignal.update((items) => [...items, toast]);
    window.setTimeout(() => this.dismissToast(toast.id), TOAST_DURATION_MS);
  }

  private async command(name: string, payload: unknown = {}, loading?: string): Promise<boolean> {
    try {
      if (loading) this.loadingSignal.set(loading);
      await this.connect();
      await this.hub.dispatch({ name, payload });
      return true;
    } catch (error) {
      this.notify('error', error instanceof Error ? error.message : 'No fue posible comunicarse con la partida.');
      return false;
    } finally {
      this.loadingSignal.set(null);
    }
  }

  private async restorePlayer(): Promise<void> {
    const playerId = this.playerIdSignal();
    if (!playerId || this.restoring) return this.restoring;
    this.restoring = this.hub.dispatch({ name: 'resume-player', payload: { playerId } })
      .catch(() => this.clearPlayerSession())
      .finally(() => { this.restoring = undefined; });
    return this.restoring;
  }

  private consume(type: string, payload: unknown): void {
    if (type === 'game-state' && isHubState(payload)) {
      this.stateSignal.set(payload);
      if (payload.status === 'finished') this.selectedTileSignal.set(undefined);
      return;
    }
    if (type === 'player-session' && hasString(payload, 'playerId')) {
      sessionStorage.setItem(SESSION_PLAYER_KEY, payload['playerId']);
      this.playerIdSignal.set(payload['playerId']);
      return;
    }
    if (type === 'wall-hit' && isWallHit(payload)) {
      const wall = toWallVisual(payload.wall);
      this.revealedWallsSignal.set([wall]);
      this.wallNoticeSignal.set({ byPlayerName: 'Un explorador', text: '¡Muro descubierto! Recordá su posición antes de que vuelva a ocultarse.' });
      if (this.wallTimer) clearTimeout(this.wallTimer);
      this.wallTimer = window.setTimeout(() => this.clearWallNotice(), payload.durationMs);
      return;
    }
    if ((type === 'action-rejected' || type === 'internal-error') && hasString(payload, 'message')) this.notify('error', payload['message']);
  }

  private clearWallNotice(): void {
    if (this.wallTimer) clearTimeout(this.wallTimer);
    this.wallTimer = undefined;
    this.wallNoticeSignal.set(null);
    this.revealedWallsSignal.set([]);
  }

  private clearPlayerSession(): void { sessionStorage.removeItem(SESSION_PLAYER_KEY); this.playerIdSignal.set(null); }
  private reset(): void { this.stateSignal.set(emptyState()); this.modeSignal.set('player'); this.selectedTileSignal.set(undefined); this.clearWallNotice(); }
}

function emptyState(): HubState { return { status: 'none', players: [], currentPlayerId: null, activeSymbolId: null, remainingSteps: 0, winnerPlayerId: null, walls: [], symbols: {} }; }
function phaseFor(status: HubState['status']): GamePhase { return status === 'inprogress' ? 'playing' : status === 'finished' ? 'finished' : status === 'lobby' ? 'lobby' : 'home'; }
function colorFor(color: string | null): string { return color ? ({ red: '#ef5b5b', blue: '#4db7ff', green: '#4ee29a', yellow: '#f5c451' }[color.toLowerCase()] ?? color) : '#718096'; }
function readableSymbol(id: string): string { return `Símbolo mágico ${id.replace('Symbol', '#')}`; }
function connectionStatusFor(status: HubConnectionState): ConnectionStatus { return status === HubConnectionState.Connected ? 'connected' : status === HubConnectionState.Reconnecting ? 'reconnecting' : status === HubConnectionState.Connecting ? 'connecting' : 'disconnected'; }
function directionFrom(from: BoardPosition, to: BoardPosition): 'Up' | 'Down' | 'Left' | 'Right' | null { if (to.column === from.column && to.row === from.row - 1) return 'Up'; if (to.column === from.column && to.row === from.row + 1) return 'Down'; if (to.row === from.row && to.column === from.column - 1) return 'Left'; if (to.row === from.row && to.column === from.column + 1) return 'Right'; return null; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function hasString(value: unknown, key: string): value is Record<string, string> { return isRecord(value) && typeof value[key] === 'string'; }
function isHubState(value: unknown): value is HubState { return isRecord(value) && typeof value['status'] === 'string' && Array.isArray(value['players']) && Array.isArray(value['walls']) && isRecord(value['symbols']); }
function isWallHit(value: unknown): value is { wall: HubWall; durationMs: number } { return isRecord(value) && isRecord(value['wall']) && typeof value['durationMs'] === 'number'; }
function toWallVisual(wall: HubWall): WallVisual { return wall.fromRow === wall.toRow ? { position: { row: wall.fromRow, column: Math.min(wall.fromColumn, wall.toColumn) }, orientation: 'vertical', justRevealed: true } : { position: { row: Math.min(wall.fromRow, wall.toRow), column: wall.fromColumn }, orientation: 'horizontal', justRevealed: true }; }
