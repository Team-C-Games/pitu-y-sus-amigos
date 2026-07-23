import { BoardPosition } from './board-position';

export interface PieceVisual {
  readonly id: string;
  readonly color: string;
  readonly label: string;
  readonly position: BoardPosition;
  /** La pieza pertenece al jugador con el turno activo. */
  readonly isActive?: boolean;
}
