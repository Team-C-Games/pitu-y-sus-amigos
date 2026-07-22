import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lobby-code',
  templateUrl: './lobby-code.component.html',
  styleUrls: ['./lobby-code.component.scss']
})
export class LobbyCodeComponent {
  @Input() gameCode!: string;
}
