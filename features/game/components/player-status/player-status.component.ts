import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.scss']
})
export class PlayerStatusComponent {
  @Input() playerName!: string;
  @Input() playerAvatar?: string;
  @Input() treasureCount!: number;
}
