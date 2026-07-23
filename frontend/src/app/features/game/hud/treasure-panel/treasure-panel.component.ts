import { Component, input } from '@angular/core';
import { TreasureVisual } from '../models';

/** Objetivo mágico que la partida persigue actualmente. */
@Component({
  selector: 'app-treasure-panel',
  templateUrl: './treasure-panel.component.html',
  styleUrl: './treasure-panel.component.scss',
})
export class TreasurePanelComponent {
  readonly treasure = input<TreasureVisual | null>(null);
}
