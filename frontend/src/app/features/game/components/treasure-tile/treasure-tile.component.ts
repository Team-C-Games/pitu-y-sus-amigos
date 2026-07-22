import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-treasure-tile',
  templateUrl: './treasure-tile.component.html',
  styleUrls: ['./treasure-tile.component.scss'],
  imports: [
    CommonModule
  ]
})
export class TreasureTileComponent {
  @Input() found!: boolean;
}
