import { BoardPosition } from './board-position';

export type TileKind = 'plain' | 'objective' | 'start';

export interface TileVisual {
  readonly position: BoardPosition;
  readonly kind?: TileKind;
  /** Glifo del símbolo mágico cuando la celda es un objetivo. */
  readonly symbol?: string;
  /** El objetivo de esta celda ya fue encontrado. */
  readonly symbolFound?: boolean;
  /** Celda resaltada (alcanzable / seleccionable). */
  readonly emphasized?: boolean;
  /** Texto accesible de la celda. */
  readonly label?: string;
}
