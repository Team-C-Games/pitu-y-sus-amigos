export type GamePhase = 'home' | 'lobby' | 'playing' | 'finished';
export type PlayerMode = 'player' | 'spectator';
export type TurnState = 'myTurn' | 'waiting' | 'finished';
export type UiOverlay = 'loading' | 'reconnecting' | 'none';

export interface GameUiState {
  readonly gamePhase: GamePhase;
  readonly playerMode: PlayerMode;
  readonly turnState: TurnState;
  readonly overlays: UiOverlay;
}
