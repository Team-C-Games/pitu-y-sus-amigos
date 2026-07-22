import { Component, input } from '@angular/core';
import { TileComponent } from './tile/tile.component';
import { BoardPosition, TileVisual } from './models';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly tiles = input<readonly TileVisual[]>([]);

  protected readonly indexes = [0, 1, 2, 3, 4, 5];

  protected tileFor(row: number, column: number): TileVisual | undefined {
    return this.tiles().find(
      (tile) => tile.position.row === row && tile.position.column === column
    );
  }

  protected positionFor(row: number, column: number): BoardPosition {
    return { row, column };
  }
}
