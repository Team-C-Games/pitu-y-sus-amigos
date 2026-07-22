import { BoardPosition } from './board-position';

export type WallOrientation = 'horizontal' | 'vertical';

export interface WallVisual {
  readonly position: BoardPosition;
  readonly orientation: WallOrientation;
}
