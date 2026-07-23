import { Component, computed, input, output } from '@angular/core';
import { TileComponent } from './tile/tile.component';
import { PieceComponent } from './piece/piece.component';
import { WallComponent } from './wall/wall.component';
import { BoardPosition, BoardVisualState, PieceVisual, TileVisual, WallVisual } from './models';

/** Desplazamientos (en fracción de celda) para piezas que comparten casilla. */
const STACK_OFFSETS: readonly { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: -0.22, y: -0.22 },
  { x: 0.22, y: -0.22 },
  { x: 0, y: 0.24 },
];

/**
 * Tablero 6×6 presentacional. Recibe todo por `boardVisualState` y solo
 * emite la celda elegida; no conoce reglas ni transporte.
 */
@Component({
  selector: 'app-board',
  imports: [TileComponent, PieceComponent, WallComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  readonly boardVisualState = input.required<BoardVisualState>();
  /** Permite seleccionar celdas (jugador con turno activo). */
  readonly interactive = input<boolean>(false);
  readonly tileSelected = output<BoardPosition>();

  protected readonly indexes = computed(() =>
    Array.from({ length: this.boardVisualState().size }, (_, i) => i)
  );

  protected tileFor(row: number, column: number): TileVisual | undefined {
    return this.boardVisualState().cells.find(
      (tile) => tile.position.row === row && tile.position.column === column
    );
  }

  protected isSelected(row: number, column: number): boolean {
    const selection = this.boardVisualState().selection;
    return selection?.row === row && selection?.column === column;
  }

  protected onTileClick(row: number, column: number): void {
    if (this.interactive()) {
      this.tileSelected.emit({ row, column });
    }
  }

  protected pieceLeft(piece: PieceVisual): string {
    const size = this.boardVisualState().size;
    const stack = this.stackOffset(piece);
    return `${((piece.position.column + 0.5 + stack.x) * 100) / size}%`;
  }

  protected pieceTop(piece: PieceVisual): string {
    const size = this.boardVisualState().size;
    const stack = this.stackOffset(piece);
    return `${((piece.position.row + 0.5 + stack.y) * 100) / size}%`;
  }

  protected wallLeft(wall: WallVisual): string {
    const size = this.boardVisualState().size;
    const column = wall.orientation === 'vertical' ? wall.position.column + 1 : wall.position.column;
    return `${(column * 100) / size}%`;
  }

  protected wallTop(wall: WallVisual): string {
    const size = this.boardVisualState().size;
    const row = wall.orientation === 'horizontal' ? wall.position.row + 1 : wall.position.row;
    return `${(row * 100) / size}%`;
  }

  protected wallLength(): string {
    return `${100 / this.boardVisualState().size}%`;
  }

  protected wallKey(wall: WallVisual): string {
    return `${wall.position.row}-${wall.position.column}-${wall.orientation}`;
  }

  private stackOffset(piece: PieceVisual): { x: number; y: number } {
    const siblings = this.boardVisualState().pieces.filter(
      (other) =>
        other.position.row === piece.position.row &&
        other.position.column === piece.position.column
    );
    if (siblings.length <= 1) {
      return STACK_OFFSETS[0];
    }
    const index = siblings.findIndex((other) => other.id === piece.id);
    return STACK_OFFSETS[index % STACK_OFFSETS.length];
  }
}
