import { Component, Input } from '@angular/core';
import { LobbyPlayer } from '../../models/lobby-player';

@Component({
  selector: 'app-lobby-player-list',
  templateUrl: './lobby-player-list.component.html',
  styleUrls: ['./lobby-player-list.component.scss']
})
export class LobbyPlayerListComponent {
  @Input() players!: LobbyPlayer[];
}
