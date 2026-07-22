import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { NotificationToastComponent } from '../../../shared/components/notification-toast/notification-toast.component';
import { TopBarComponent } from '../../../shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-app-layout',
  imports: [
    TopBarComponent, 
    RouterOutlet, 
    LoadingOverlayComponent, 
    NotificationToastComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
}
