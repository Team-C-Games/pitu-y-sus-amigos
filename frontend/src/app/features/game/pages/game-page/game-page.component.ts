import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameFacade } from '../../../../core/facade';
import { BoardComponent } from '../../board/board.component';
import { BoardPosition } from '../../board/models';
import { TurnIndicatorComponent } from '../../hud/turn-indicator/turn-indicator.component';
import { TreasurePanelComponent } from '../../hud/treasure-panel/treasure-panel.component';
import { DicePanelComponent } from '../../hud/dice-panel/dice-panel.component';
import { ActionPanelComponent } from '../../hud/action-panel/action-panel.component';
import { PlayerStatusComponent } from '../../hud/player-status/player-status.component';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
  imports: [
    BoardComponent,
    TurnIndicatorComponent,
    TreasurePanelComponent,
    DicePanelComponent,
    ActionPanelComponent,
    PlayerStatusComponent,
  ],
})
export class GamePageComponent {
  protected readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  protected onTileSelected(position: BoardPosition): void {
    this.facade.selectTile(position);
  }

  protected async onRollRequested(): Promise<void> {
    await this.facade.rollDice();
  }

  protected async onActionSelected(actionId: string): Promise<void> {
    if (actionId === 'leave') {
      await this.facade.leaveGame();
      void this.router.navigate(['/']);
      return;
    }
    await this.facade.performAction(actionId);
  }
}
