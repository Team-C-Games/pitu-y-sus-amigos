import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type TreasureObjectiveState = 'hidden' | 'revealed' | 'found';

@Component({
  selector: 'app-treasure-panel',
  templateUrl: './treasure-panel.component.html',
  styleUrls: ['./treasure-panel.component.scss'],
  imports: [CommonModule],
})
export class TreasurePanelComponent {
  @Input() treasureObjective = '';
  @Input() objectiveState: TreasureObjectiveState = 'hidden';
  @Input() hiddenLabel = 'Objetivo oculto';
  @Input() revealedLabel = 'Objetivo revelado';
  @Input() foundLabel = 'Objetivo encontrado';
}
