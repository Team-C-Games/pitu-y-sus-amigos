import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-treasure-panel',
  templateUrl: './treasure-panel.component.html',
  styleUrls: ['./treasure-panel.component.scss']
})
export class TreasurePanelComponent {
  @Input() treasureObjective!: string;
}
