import { Component, Input } from '@angular/core';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  @Input() title!: Signal<string>;
  @Input() connectionStatus!: Signal<ConnectionStatus>;
  @Input() currentPlayer!: Signal<string | null>;
  @Input() gameCode!: Signal<string | null>;
}
