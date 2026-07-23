/**
 * Modelos de vista transversales que consume la capa de pantallas.
 * Son puramente presentacionales: la futura integración real con SignalR
 * los seguirá produciendo desde `GameFacade`.
 */

export type GamePhase = 'home' | 'lobby' | 'playing' | 'finished';

export type PlayerMode = 'player' | 'spectator';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  readonly id: number;
  readonly kind: ToastKind;
  readonly text: string;
}

/** Aviso temporal de muro descubierto tras una colisión. */
export interface WallNotice {
  readonly byPlayerName: string;
  readonly text: string;
}

export interface GameSummaryEntry {
  readonly playerName: string;
  readonly color: string;
  readonly symbolsFound: number;
  readonly isWinner: boolean;
}
