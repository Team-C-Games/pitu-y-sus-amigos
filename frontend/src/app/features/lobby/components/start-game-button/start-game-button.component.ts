import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-start-game-button',
  templateUrl: './start-game-button.component.html',
  styleUrls: ['./start-game-button.component.scss'],
  imports: [
    CommonModule
  ]
})
export class StartGameButtonComponent {
  @Input() enabled = false;
  @Output() startGame = new EventEmitter<void>();

  onButtonClick(): void {
    if (this.enabled) {
      this.startGame.emit();
    }
  }
}
