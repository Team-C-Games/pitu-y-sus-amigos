export interface LobbyPlayer {
  readonly id: string;
  readonly name: string;
  /** Color asignado al jugador dentro de la partida. */
  readonly color: string;
  readonly isHost: boolean;
  readonly isReady: boolean;
  readonly isCurrentTurn: boolean;
}
