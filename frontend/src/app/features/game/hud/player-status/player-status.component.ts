import { Component, input } from '@angular/core';
import { PlayerStatusVisual } from '../models';

/** Fila de estado de un jugador dentro del HUD. */
@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrl: './player-status.component.scss',
})
export class PlayerStatusComponent {
  readonly player = input.required<PlayerStatusVisual>();
}
