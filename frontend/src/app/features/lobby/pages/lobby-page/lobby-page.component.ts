import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameFacade } from '../../../../core/facade';
import { LobbyPlayer } from '../../models';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss'],
  imports: [PlayerCardComponent],
})
export class LobbyPageComponent {
  protected readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  /** Ranuras fijas de la sala: jugadores presentes + lugares libres hasta 4. */
  protected readonly slots = computed<readonly (LobbyPlayer | null)[]>(() => {
    const players = this.facade.lobbyPlayers();
    return [
      ...players,
      ...Array.from({ length: Math.max(0, this.facade.maxPlayers - players.length) }, () => null),
    ];
  });

  protected readonly statusText = computed(() => {
    const count = this.facade.playerCount();
    if (count < this.facade.minPlayers) {
      return `Falta al menos ${this.facade.minPlayers - count} jugador para poder empezar.`;
    }
    if (!this.facade.canStartGame()) {
      return 'Cuando todos estén listos, el anfitrión podrá iniciar la expedición.';
    }
    return this.facade.isLocalHost()
      ? '¡Todo listo! Podés iniciar la partida.'
      : 'Todo listo. Esperando a que el anfitrión inicie la partida…';
  });

  protected async chooseColor(color: string): Promise<void> {
    await this.facade.chooseColor(color);
  }

  protected async markReady(): Promise<void> {
    await this.facade.markReady();
  }

  protected async startGame(): Promise<void> {
    if (!this.facade.canStartGame()) {
      return;
    }
    if (await this.facade.startGame()) void this.router.navigate(['/game']);
  }

  protected async leave(): Promise<void> {
    await this.facade.leaveGame();
    void this.router.navigate(['/']);
  }
}
