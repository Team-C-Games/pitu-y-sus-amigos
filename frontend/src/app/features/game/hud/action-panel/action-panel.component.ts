import { Component, input, output } from '@angular/core';
import { GameActionVisual } from '../models';

/** Panel de acciones del turno. Emite el id de la acción elegida. */
@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrl: './action-panel.component.scss',
})
export class ActionPanelComponent {
  readonly actions = input<readonly GameActionVisual[]>([]);
  readonly actionSelected = output<string>();
}
