import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ready-button',
  templateUrl: './ready-button.component.html',
  styleUrls: ['./ready-button.component.scss']
})
export class ReadyButtonComponent {
  @Input() ready = false;
  @Output() readyChanged = new EventEmitter<boolean>();

  toggleReady(): void {
    this.readyChanged.emit(!this.ready);
  }
}
