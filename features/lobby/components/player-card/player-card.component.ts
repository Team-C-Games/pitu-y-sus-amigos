import { Component, Input } from '@angular/core';
import { LobbyPlayer } from '../../models/lobby-player';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent {
  @Input() player!: LobbyPlayer;
}
