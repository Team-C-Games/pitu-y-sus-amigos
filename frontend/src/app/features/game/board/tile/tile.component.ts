import { Component, input } from '@angular/core';
import { BoardPosition, TileVisual } from '../models';

@Component({
  selector: 'app-tile',
  standalone: true,
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  readonly position = input.required<BoardPosition>();
  readonly visual = input<TileVisual>();
}
