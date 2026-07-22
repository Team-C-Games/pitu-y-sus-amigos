import { Component, Input } from '@angular/core';
import { LobbyPlayer } from '../../models/lobby-player';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent {
  @Input() players: LobbyPlayer[] = [
    { id: '1', name: 'Player 1', isHost: true, isReady: false, isCurrentTurn: false },
    { id: '2', name: 'Player 2', isHost: false, isReady: true, isCurrentTurn: true },
    { id: '3', name: 'Player 3', isHost: false, isReady: false, isCurrentTurn: false }
  ];
}
