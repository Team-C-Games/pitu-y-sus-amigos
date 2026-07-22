import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss']
})
export class NotificationToastComponent {
  @Input() message!: Signal<string>;
  @Input() type!: Signal<'success' | 'error' | 'warning' | 'info'>;
  @Input() duration!: Signal<number>;

  @Output() closed = new EventEmitter<void>();

  private timeoutId: number | null = null;

  ngOnChanges(): void {
    if (this.duration()) {
      this.timeoutId = setTimeout(() => {
        this.closed.emit();
      }, this.duration());
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  closeManually(): void {
    this.closed.emit();
  }
}
