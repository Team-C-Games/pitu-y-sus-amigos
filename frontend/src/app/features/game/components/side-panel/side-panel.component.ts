import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface SidePanelPlayer {
  readonly id: string;
  readonly name: string;
  readonly isReady?: boolean;
  readonly isCurrentTurn?: boolean;
}

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  imports: [
    CommonModule,
  ],
})
export class SidePanelComponent {
  @Input() players: SidePanelPlayer[] = [];
  @Input() currentTurnPlayer?: SidePanelPlayer;
  @Input() readyPlayers: SidePanelPlayer[] = [];
  @Input() spectators: string[] = [];
  @Input() treasuresFound = 0;
}
