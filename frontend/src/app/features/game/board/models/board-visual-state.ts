import { BoardPosition } from './board-position';
import { PieceVisual } from './piece-visual';
import { TileVisual } from './tile-visual';
import { WallVisual } from './wall-visual';

export interface BoardVisualState {
  /** Cantidad de filas/columnas del tablero (6 para El Laberinto Mágico). */
  readonly size: number;
  readonly cells: readonly TileVisual[];
  readonly pieces: readonly PieceVisual[];
  /** Solo los muros actualmente revelados. */
  readonly walls: readonly WallVisual[];
  readonly selection?: BoardPosition;
}

export const EMPTY_BOARD_VISUAL_STATE: BoardVisualState = {
  size: 6,
  cells: [],
  pieces: [],
  walls: [],
};
