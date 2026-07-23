import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameFacade } from '../../../../core/facade';

/** Cierre de partida: ganador, resumen y acciones de salida. */
@Component({
  selector: 'app-game-over-page',
  templateUrl: './game-over-page.component.html',
  styleUrls: ['./game-over-page.component.scss'],
})
export class GameOverPageComponent {
  protected readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  protected playAgain(): void {
    this.facade.restartGame();
    void this.router.navigate(['/lobby']);
  }

  protected goHome(): void {
    this.facade.leaveGame();
    void this.router.navigate(['/']);
  }
}
