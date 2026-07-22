import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { SidePanelComponent } from '../../components/side-panel/side-panel.component';
import { ActionPanelComponent } from '../../components/action-panel/action-panel.component';
import { GameUiFacade } from '../../services';
import { PlayerStatusComponent } from '../../components/player-status/player-status.component';
import { TreasurePanelComponent } from '../../hud/treasure-panel/treasure-panel.component';
import { DicePanelComponent } from '../../hud/dice-panel/dice-panel.component';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  imports: [
    CommonModule, 
    GameBoardComponent, 
    SidePanelComponent, 
    ActionPanelComponent,
    PlayerStatusComponent,
    TreasurePanelComponent,
    DicePanelComponent
  ],
})
export class GamePageComponent {
  private readonly gameUiFacade = inject(GameUiFacade);

  protected readonly uiState = this.gameUiFacade.state;
}
