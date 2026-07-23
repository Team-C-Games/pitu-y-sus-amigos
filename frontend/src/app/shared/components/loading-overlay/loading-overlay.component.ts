import { Component, input } from '@angular/core';

/**
 * Overlay de carga/reconexión. Presentacional: el layout decide cuándo
 * mostrarlo a partir del estado de la fachada.
 */
@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent {
  readonly visible = input<boolean>(false);
  readonly message = input<string | null>(null);
}
