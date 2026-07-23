import { Component, input, output } from '@angular/core';

/**
 * Modal genérico reutilizable (confirmaciones, avisos). Presentacional:
 * quien lo usa controla apertura y reacciona a los eventos.
 */
@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
})
export class BaseModalComponent {
  readonly opened = input<boolean>(false);
  readonly title = input<string>('');
  readonly closable = input<boolean>(true);
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');

  readonly closed = output<void>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected onBackdropClick(): void {
    if (this.closable()) {
      this.closed.emit();
    }
  }
}
