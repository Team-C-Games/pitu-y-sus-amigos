import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BoardComponent } from '../../board/board.component';
import { BoardVisualState } from '../../board/models';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  imports: [CommonModule, BoardComponent],
})
export class GameBoardComponent {
  @Input() boardVisualState: BoardVisualState = {
    cells: [],
    pieces: [],
    walls: [],
    animations: [],
    selection: undefined,
  };
}
