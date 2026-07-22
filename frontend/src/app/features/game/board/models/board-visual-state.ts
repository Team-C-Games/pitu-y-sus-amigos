import { BoardPosition } from './board-position';
import { PieceVisual } from './piece-visual';
import { TileVisual } from './tile-visual';
import { WallVisual } from './wall-visual';

export interface BoardVisualState {
  readonly cells: readonly TileVisual[];
  readonly pieces: readonly PieceVisual[];
  readonly walls: readonly WallVisual[];
  readonly animations: readonly string[];
  readonly selection?: BoardPosition;
}
