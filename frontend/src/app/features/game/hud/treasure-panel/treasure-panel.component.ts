import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TreasureVisual } from '../models';

@Component({
  selector: 'app-treasure-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treasure-panel.component.html',
  styleUrl: './treasure-panel.component.scss',
})
export class TreasurePanelComponent {
  readonly treasure = input<TreasureVisual | null>(null);
}
