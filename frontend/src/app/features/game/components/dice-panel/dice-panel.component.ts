import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type DicePanelState = 'available' | 'rolling' | 'result';

@Component({
  selector: 'app-dice-panel',
  templateUrl: './dice-panel.component.html',
  styleUrls: ['./dice-panel.component.scss'],
  imports: [CommonModule],
})
export class DicePanelComponent {
  @Input() diceState: DicePanelState = 'available';
  @Input() diceValue?: number;
  @Input() isDisabled = false;

  @Output() rollRequested = new EventEmitter<void>();

  onRollClick(): void {
    this.rollRequested.emit();
  }
}
