import { Component, input } from '@angular/core';
import { TileComponent } from './tile/tile.component';
import { PieceComponent } from './piece/piece.component';
import { WallComponent } from './wall/wall.component';
import { BoardPosition, BoardVisualState, TileVisual } from './models';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TileComponent, PieceComponent, WallComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly boardVisualState = input.required<BoardVisualState>();

  protected readonly indexes = [0, 1, 2, 3, 4, 5];

  protected tileFor(row: number, column: number): TileVisual | undefined {
    return this.boardVisualState().cells.find(
      (tile) => tile.position.row === row && tile.position.column === column
    );
  }

  protected positionFor(row: number, column: number): BoardPosition {
    return { row, column };
  }

  protected hasSelection(): boolean {
    return this.boardVisualState().selection !== undefined;
  }

  protected hasAnimations(): boolean {
    return this.boardVisualState().animations.length > 0;
  }
}
