import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameFacade } from '../../facade';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay';
import { NotificationToastComponent } from '../../../shared/components/notification-toast';
import { TopBarComponent } from '../../../shared/components/top-bar';

/**
 * Shell de la aplicación: única pieza que conecta la fachada con los
 * componentes transversales (top bar, overlay, toasts).
 */
@Component({
  selector: 'app-app-layout',
  imports: [TopBarComponent, RouterOutlet, LoadingOverlayComponent, NotificationToastComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent {
  protected readonly facade = inject(GameFacade);

  protected readonly playerName = computed(() => {
    const name = this.facade.playerName();
    return name.length > 0 ? name : null;
  });

  protected readonly overlayVisible = computed(
    () => this.facade.isLoading() || this.facade.connectionStatus() === 'reconnecting'
  );

  protected readonly overlayMessage = computed(() =>
    this.facade.connectionStatus() === 'reconnecting'
      ? 'Reconectando con la partida…'
      : this.facade.loadingMessage()
  );
}
