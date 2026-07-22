import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
export class BaseModalComponent {
  @Input() title!: Signal<string>;
  @Input() opened!: Signal<boolean>;
  @Input() closable!: Signal<boolean>;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onClose(): void {
    if (this.closable()) {
      this.closed.emit();
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
