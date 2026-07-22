import { LobbyPlayer } from './lobby-player';

export interface LobbyUiState {
  readonly roomCode: string;
  readonly players: readonly LobbyPlayer[];
  readonly readyPlayers: readonly LobbyPlayer[];
  readonly spectators: readonly string[];
  readonly canStartGame: boolean;
  readonly isPlayerReady: boolean;
}
