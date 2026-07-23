import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConnectionStatus } from '../../../core/facade/facade-models';

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connecting: 'Conectando…',
  connected: 'Conectado',
  reconnecting: 'Reconectando…',
  disconnected: 'Sin conexión',
};

/**
 * Barra superior presentacional. No conoce SignalR: recibe todo por inputs
 * desde el layout, que a su vez lee la fachada.
 */
@Component({
  selector: 'app-top-bar',
  imports: [RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  readonly title = input<string>('El Laberinto Mágico');
  readonly connectionStatus = input<ConnectionStatus>('disconnected');
  readonly playerName = input<string | null>(null);

  protected readonly statusLabel = computed(() => STATUS_LABELS[this.connectionStatus()]);

  protected readonly statusClass = computed(() => {
    switch (this.connectionStatus()) {
      case 'connected':
        return 'pill--ok';
      case 'reconnecting':
      case 'connecting':
        return 'pill--warn';
      default:
        return 'pill--bad';
    }
  });
}
