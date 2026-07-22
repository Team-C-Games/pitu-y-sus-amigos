import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DiceVisual } from '../models';

@Component({
  selector: 'app-dice-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice-panel.component.html',
  styleUrl: './dice-panel.component.scss',
})
export class DicePanelComponent {
  readonly dice = input<DiceVisual | null>(null);
  readonly rollRequested = output<void>();
}
