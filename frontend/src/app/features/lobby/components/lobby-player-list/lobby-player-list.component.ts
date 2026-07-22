import { Component, Input } from '@angular/core';
import { LobbyPlayer } from '../../models/lobby-player';
import { CommonModule } from '@angular/common';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
  selector: 'app-lobby-player-list',
  templateUrl: './lobby-player-list.component.html',
  styleUrls: ['./lobby-player-list.component.scss'],
  imports: [
    CommonModule,
    PlayerCardComponent
  ]
})
export class LobbyPlayerListComponent {
  @Input() players!: LobbyPlayer[];
}
