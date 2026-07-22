import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TurnVisual } from '../models';

@Component({
  selector: 'app-turn-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turn-indicator.component.html',
  styleUrl: './turn-indicator.component.scss',
})
export class TurnIndicatorComponent {
  readonly turn = input<TurnVisual | null>(null);
}
