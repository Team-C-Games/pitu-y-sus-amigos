import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { GameActionVisual } from '../models';

@Component({
  selector: 'app-action-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-panel.component.html',
  styleUrl: './action-panel.component.scss',
})
export class ActionPanelComponent {
  readonly actions = input<readonly GameActionVisual[]>([]);
  readonly actionSelected = output<string>();
}
