import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpectatorUiState } from '../../models';

@Component({
  selector: 'app-spectator-page',
  templateUrl: './spectator-page.component.html',
  styleUrls: ['./spectator-page.component.scss'],
  imports: [CommonModule],
})
export class SpectatorPageComponent {
  @Input() spectatorUiState: SpectatorUiState = {
    title: 'Observando partida',
    watchingLabel: 'Observando partida',
  };
}