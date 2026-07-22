import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerStatusComponent } from '../player-status/player-status.component';
import { TurnIndicatorComponent } from '../turn-indicator/turn-indicator.component';
import { DicePanelComponent } from '../dice-panel/dice-panel.component';
import { ActionPanelComponent } from '../action-panel/action-panel.component';

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
    PlayerStatusComponent,
    TurnIndicatorComponent,
    DicePanelComponent,
    ActionPanelComponent,
  ],
})
export class SidePanelComponent {
  @Input() players: SidePanelPlayer[] = [];
  @Input() currentTurnPlayer?: SidePanelPlayer;
  @Input() readyPlayers: SidePanelPlayer[] = [];
  @Input() spectators: string[] = [];
  @Input() treasuresFound = 0;
}
