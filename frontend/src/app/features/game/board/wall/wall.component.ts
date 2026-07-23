import { Component, input } from '@angular/core';
import { WallVisual } from '../models';

/** Muro revelado del laberinto (los muros ocultos no se dibujan). */
@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss',
})
export class WallComponent {
  readonly wall = input.required<WallVisual>();
}
