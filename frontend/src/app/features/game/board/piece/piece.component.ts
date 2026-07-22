import { Component, input } from '@angular/core';
import { PieceVisual } from '../models';

@Component({
  selector: 'app-piece',
  standalone: true,
  templateUrl: './piece.component.html',
  styleUrl: './piece.component.scss',
})
export class PieceComponent {
  readonly piece = input.required<PieceVisual>();
}
