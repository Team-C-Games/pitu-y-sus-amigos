import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameBoardComponent } from '../../../game/components/game-board/game-board.component';
import { SidePanelComponent } from '../../../game/components/side-panel/side-panel.component';
import { ActionPanelComponent } from '../../../game/components/action-panel/action-panel.component';
import { PlayerStatusComponent } from '../../../game/components/player-status/player-status.component';
import { TreasurePanelComponent } from '../../../game/hud/treasure-panel/treasure-panel.component';
import { SpectatorUiState } from '../../models';

@Component({
  selector: 'app-spectator-page',
  templateUrl: './spectator-page.component.html',
  styleUrls: ['./spectator-page.component.scss'],
  imports: [
    CommonModule,
    GameBoardComponent,
    SidePanelComponent,
    ActionPanelComponent,
    PlayerStatusComponent,
    TreasurePanelComponent,
  ],
})
export class SpectatorPageComponent {
  @Input() spectatorUiState: SpectatorUiState = {
    title: 'Observando partida',
    watchingLabel: 'Observando partida',
  };
}