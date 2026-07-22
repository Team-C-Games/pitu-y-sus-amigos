import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HiddenWallComponent } from '../hidden-wall/hidden-wall.component';
import { TreasureTileComponent } from '../treasure-tile/treasure-tile.component';
import { PlayerPieceComponent } from '../player-piece/player-piece.component';
import { BoardTileComponent } from '../board-tile/board-tile.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  imports: [
    CommonModule,
    BoardTileComponent,
    PlayerPieceComponent,
    TreasureTileComponent,
    HiddenWallComponent
  ]
})
export class GameBoardComponent {}
