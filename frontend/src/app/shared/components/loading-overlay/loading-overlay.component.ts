import { Component, Input } from '@angular/core';
import { Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
  @Input() visible!: Signal<boolean>;
  @Input() message!: Signal<string | null>;
}
