import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lobby-code',
  templateUrl: './lobby-code.component.html',
  styleUrls: ['./lobby-code.component.scss'],
  imports: [
    CommonModule
  ]
})
export class LobbyCodeComponent {
  @Input() gameCode!: string;
}
