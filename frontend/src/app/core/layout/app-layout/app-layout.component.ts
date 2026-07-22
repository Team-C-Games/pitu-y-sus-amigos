import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { NotificationToastComponent } from '../../../shared/components/notification-toast/notification-toast.component';
import { TopBarComponent } from '../../../shared/components/top-bar/top-bar.component';
import { NotificationFacade } from '../../../shared/services/notification-facade.service';

@Component({
  selector: 'app-app-layout',
  imports: [
    TopBarComponent,
    RouterOutlet,
    LoadingOverlayComponent,
    NotificationToastComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent {
  private readonly notificationFacade = inject(NotificationFacade);

  protected readonly activeNotification = this.notificationFacade.activeNotification;
  protected readonly activeMessage = computed(() => this.activeNotification()?.message ?? '');
  protected readonly activeType = computed(() => this.activeNotification()?.type ?? 'info');
  protected readonly activeDuration = computed(() => this.activeNotification()?.duration ?? 3000);

  protected dismissCurrent(): void {
    this.notificationFacade.dismissCurrent();
  }
}
