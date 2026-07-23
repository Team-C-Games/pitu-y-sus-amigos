import { BoardPosition } from './board-position';

export type WallOrientation = 'horizontal' | 'vertical';

/**
 * Muro visible en el tablero. Los muros del laberinto están ocultos:
 * solo llegan a esta capa visual los que fueron revelados por una colisión.
 */
export interface WallVisual {
  readonly position: BoardPosition;
  readonly orientation: WallOrientation;
  /** Revelado recientemente: se dibuja con animación de descubrimiento. */
  readonly justRevealed?: boolean;
}
