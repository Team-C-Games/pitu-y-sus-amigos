import { BoardPosition } from './board-position';

export interface TileVisual {
  readonly position: BoardPosition;
  readonly label?: string;
  readonly emphasized?: boolean;
}
