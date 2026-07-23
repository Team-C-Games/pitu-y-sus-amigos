import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameFacade } from '../../../../core/facade';
import { BoardComponent } from '../../../game/board/board.component';
import { TurnIndicatorComponent } from '../../../game/hud/turn-indicator/turn-indicator.component';
import { TreasurePanelComponent } from '../../../game/hud/treasure-panel/treasure-panel.component';
import { PlayerStatusComponent } from '../../../game/hud/player-status/player-status.component';

/**
 * Vista de espectador: mismo tablero y estado que la partida, pero sin
 * ningún control de juego habilitado.
 */
@Component({
  selector: 'app-spectator-page',
  templateUrl: './spectator-page.component.html',
  styleUrls: ['./spectator-page.component.scss'],
  imports: [BoardComponent, TurnIndicatorComponent, TreasurePanelComponent, PlayerStatusComponent],
})
export class SpectatorPageComponent {
  protected readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  protected leave(): void {
    this.facade.leaveGame();
    void this.router.navigate(['/']);
  }
}
