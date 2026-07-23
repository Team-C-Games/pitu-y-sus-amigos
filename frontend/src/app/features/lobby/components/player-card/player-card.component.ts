import { Component, computed, input } from '@angular/core';
import { LobbyPlayer } from '../../models';

/**
 * Tarjeta de jugador del lobby. Si `player` es null representa un
 * lugar libre de la sala (2–4 jugadores).
 */
@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent {
  readonly player = input<LobbyPlayer | null>(null);

  protected readonly initials = computed(() => {
    const name = this.player()?.name ?? '';
    return name.slice(0, 2).toUpperCase();
  });
}
