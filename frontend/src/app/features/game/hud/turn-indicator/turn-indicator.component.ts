import { Component, input } from '@angular/core';
import { TurnVisual } from '../models';

/** Indicador del turno activo. */
@Component({
  selector: 'app-turn-indicator',
  templateUrl: './turn-indicator.component.html',
  styleUrl: './turn-indicator.component.scss',
})
export class TurnIndicatorComponent {
  readonly turn = input<TurnVisual | null>(null);
}
