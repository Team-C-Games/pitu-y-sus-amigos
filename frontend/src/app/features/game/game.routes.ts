import { Routes } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { GameOverPageComponent } from './pages/game-over-page/game-over-page.component';

export const GAME_ROUTES: Routes = [
  {
    path: '',
    component: GamePageComponent,
    title: 'Partida — El Laberinto Mágico',
  },
  {
    path: 'over',
    component: GameOverPageComponent,
    title: 'Final de partida — El Laberinto Mágico',
  },
];
