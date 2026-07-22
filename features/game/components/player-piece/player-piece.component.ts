import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-piece',
  templateUrl: './player-piece.component.html',
  styleUrls: ['./player-piece.component.scss']
})
export class PlayerPieceComponent {
  @Input() name!: string;
  @Input() color!: string;
}
