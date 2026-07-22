import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dice-panel',
  templateUrl: './dice-panel.component.html',
  styleUrls: ['./dice-panel.component.scss']
})
export class DicePanelComponent {
  @Input() diceValue!: number;
  @Output() rollDice = new EventEmitter<void>();

  onRollClick(): void {
    this.rollDice.emit();
  }
}
