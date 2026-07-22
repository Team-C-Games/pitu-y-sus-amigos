import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
}
