import { Component, Input } from '@angular/core';
import { LobbyPlayer } from '../../models/lobby-player';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
  imports: [
    CommonModule
  ]
})
export class PlayerCardComponent {
  @Input() player!: LobbyPlayer;
}
