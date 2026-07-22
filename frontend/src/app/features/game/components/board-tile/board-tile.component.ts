import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-tile',
  templateUrl: './board-tile.component.html',
  styleUrls: ['./board-tile.component.scss'],
  imports: [
    CommonModule
  ]
})
export class BoardTileComponent {
  @Input() position!: { row: number; col: number };
  @Input() type!: string;
}
