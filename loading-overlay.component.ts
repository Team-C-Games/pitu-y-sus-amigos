import { Component, Input } from '@angular/core';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
  @Input() visible!: Signal<boolean>;
  @Input() message!: Signal<string | null>;
}
