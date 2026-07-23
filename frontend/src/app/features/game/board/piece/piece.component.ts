import { Component, input } from '@angular/core';
import { PieceVisual } from '../models';

/** Ficha de jugador sobre el tablero. */
@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss',
})
export class PieceComponent {
  readonly piece = input.required<PieceVisual>();
}
