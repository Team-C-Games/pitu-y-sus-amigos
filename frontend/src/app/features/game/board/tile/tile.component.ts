import { Component, input } from '@angular/core';
import { BoardPosition, TileVisual } from '../models';

/** Celda del tablero. Dibuja el símbolo mágico cuando es un objetivo. */
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  readonly position = input.required<BoardPosition>();
  readonly visual = input<TileVisual>();
  readonly selected = input<boolean>(false);
  readonly interactive = input<boolean>(false);
}
