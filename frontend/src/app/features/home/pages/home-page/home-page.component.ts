import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseModalComponent } from '../../../../shared/components/base-modal/base-modal.component';
import { SessionService } from '../../../../shared/services/session.service';
import { HomeUiState } from '../../models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, RouterModule, BaseModalComponent],
})
export class HomePageComponent {
  @Input() homeUiState: HomeUiState = {
    title: 'Laberinto',
    createGameLabel: 'Crear partida',
    joinGameLabel: 'Unirse a una partida',
    spectatorLabel: 'Espectar partida',
  };

  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  protected readonly modalOpened = signal(false);
  protected readonly modalTitle = signal('Ingresa tu nombre');
  protected readonly modalClosable = signal(true);
  protected readonly playerNameDraft = signal('');

  protected openJoinModal(): void {
    this.modalOpened.set(true);
  }

  protected closeJoinModal(): void {
    this.playerNameDraft.set('');
    this.modalOpened.set(false);
  }

  protected confirmJoin(): void {
    const playerName = this.playerNameDraft().trim();

    if (!playerName) {
      return;
    }

    this.sessionService.setPlayerName(playerName);
    this.closeJoinModal();
    this.router.navigate(['/lobby']);
  }
}
