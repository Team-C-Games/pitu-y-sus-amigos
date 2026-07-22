import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { SidePanelComponent } from '../../components/side-panel/side-panel.component';
import { ActionPanelComponent } from '../../components/action-panel/action-panel.component';
import { GameUiFacade, MockGameProvider } from '../../services';
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
  private readonly mockGameProvider = inject(MockGameProvider);

  protected readonly uiState = this.gameUiFacade.state;
  protected readonly boardVisualState = this.mockGameProvider.boardVisualState;
  protected readonly players = this.mockGameProvider.players;
  protected readonly currentTurnPlayer = this.mockGameProvider.currentTurnPlayer;
  protected readonly readyPlayers = this.mockGameProvider.readyPlayers;
  protected readonly spectators = this.mockGameProvider.spectators;
  protected readonly treasuresFound = this.mockGameProvider.treasuresFound;
  protected readonly currentPlayer = this.mockGameProvider.currentPlayer;
  protected readonly treasure = this.mockGameProvider.treasure;
  protected readonly dice = this.mockGameProvider.dice;
}
