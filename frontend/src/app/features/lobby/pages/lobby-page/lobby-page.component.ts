import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StartGameButtonComponent } from '../../components/start-game-button/start-game-button.component';
import { ReadyButtonComponent } from '../../components/ready-button/ready-button.component';
import { LobbyPlayerListComponent } from '../../components/lobby-player-list/lobby-player-list.component';
import { LobbyCodeComponent } from '../../components/lobby-code/lobby-code.component';
import { LobbyUiState } from '../../models';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss'],
  imports: [
    CommonModule,
    LobbyCodeComponent,
    LobbyPlayerListComponent,
    ReadyButtonComponent,
    StartGameButtonComponent,
  ],
})
export class LobbyPageComponent {
  private readonly router = inject(Router);
  private readonly mockCurrentPlayerId = '1';

  @Input() lobbyUiState: LobbyUiState = {
    roomCode: 'ABC123',
    players: [
      { id: '1', name: 'Player 1', isHost: true, isReady: false, isCurrentTurn: false },
      { id: '2', name: 'Player 2', isHost: false, isReady: true, isCurrentTurn: true },
      { id: '3', name: 'Player 3', isHost: false, isReady: false, isCurrentTurn: false },
    ],
    readyPlayers: [
      { id: '2', name: 'Player 2', isHost: false, isReady: true, isCurrentTurn: true },
    ],
    spectators: ['Spectator 1'],
    canStartGame: true,
    isPlayerReady: false,
  };

  protected readonly uiState = signal<LobbyUiState>({ ...this.lobbyUiState });

  protected onReadyChanged(nextReady: boolean): void {
    const currentPlayers = this.uiState().players.map((player) =>
      player.id === this.mockCurrentPlayerId
        ? { ...player, isReady: nextReady }
        : player,
    );

    const readyPlayers = currentPlayers.filter((player) => player.isReady);
    const canStartGame = currentPlayers.length > 0 && currentPlayers.every((player) => player.isReady);

    this.uiState.set({
      ...this.uiState(),
      players: currentPlayers,
      readyPlayers,
      isPlayerReady: nextReady,
      canStartGame,
    });
  }

  protected onStartGame(): void {
    if (!this.uiState().canStartGame) {
      return;
    }

    this.router.navigate(['/game']);
  }
}

