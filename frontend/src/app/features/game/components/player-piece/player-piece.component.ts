import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-piece',
  templateUrl: './player-piece.component.html',
  styleUrls: ['./player-piece.component.scss'],
  imports: [
    CommonModule
  ]
})
export class PlayerPieceComponent {
  @Input() name!: string;
  @Input() color!: string;
}
