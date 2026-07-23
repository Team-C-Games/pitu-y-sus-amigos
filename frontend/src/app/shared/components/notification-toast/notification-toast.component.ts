import { Component, input, output } from '@angular/core';
import { ToastMessage } from '../../../core/facade/facade-models';

/**
 * Lista de notificaciones. Presentacional: la fachada es dueña del ciclo
 * de vida de cada toast (creación y expiración); acá solo se dibujan y se
 * notifica el cierre manual.
 */
@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss'],
})
export class NotificationToastComponent {
  readonly toasts = input<readonly ToastMessage[]>([]);
  readonly closed = output<number>();
}
