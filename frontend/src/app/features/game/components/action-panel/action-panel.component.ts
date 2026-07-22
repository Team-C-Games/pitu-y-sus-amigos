import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerMode, TurnState } from '../../models';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
  imports: [CommonModule],
})
export class ActionPanelComponent {
  @Input() turnState: TurnState = 'waiting';
  @Input() playerMode: PlayerMode = 'player';
  @Input() actions: string[] = [];
}
