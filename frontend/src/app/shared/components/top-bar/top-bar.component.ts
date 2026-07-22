import { Component, Input } from '@angular/core';
import { Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() title!: Signal<string>;
  @Input() connectionStatus!: Signal<ConnectionStatus>;
  @Input() currentPlayer!: Signal<string | null>;
  @Input() gameCode!: Signal<string | null>;
}
