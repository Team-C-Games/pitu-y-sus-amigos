import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-turn-indicator',
  templateUrl: './turn-indicator.component.html',
  styleUrls: ['./turn-indicator.component.scss'],
  imports: [
    CommonModule
  ]
})
export class TurnIndicatorComponent {
  @Input() currentPlayerName!: string;
}
