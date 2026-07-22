import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { PlayerStatusVisual } from '../models';

@Component({
  selector: 'app-player-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-status.component.html',
  styleUrl: './player-status.component.scss',
})
export class PlayerStatusComponent {
  readonly player = input.required<PlayerStatusVisual>();
}
