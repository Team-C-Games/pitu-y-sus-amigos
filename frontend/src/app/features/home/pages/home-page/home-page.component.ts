import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeUiState } from '../../models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class HomePageComponent {
  @Input() homeUiState: HomeUiState = {
    title: 'Laberinto',
    createGameLabel: 'Crear partida',
    joinGameLabel: 'Unirse a una partida',
    spectatorLabel: 'Espectar partida',
  };
}
