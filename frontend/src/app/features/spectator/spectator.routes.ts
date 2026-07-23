import { Routes } from '@angular/router';
import { SpectatorPageComponent } from './pages/spectator-page/spectator-page.component';

export const SPECTATOR_ROUTES: Routes = [
  {
    path: '',
    component: SpectatorPageComponent,
    title: 'Espectador — El Laberinto Mágico',
  },
];
