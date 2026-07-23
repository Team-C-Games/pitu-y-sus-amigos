import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'lobby',
        loadChildren: () => import('./features/lobby/lobby.routes').then((m) => m.LOBBY_ROUTES),
      },
      {
        path: 'game',
        loadChildren: () => import('./features/game/game.routes').then((m) => m.GAME_ROUTES),
      },
      {
        path: 'spectator',
        loadChildren: () =>
          import('./features/spectator/spectator.routes').then((m) => m.SPECTATOR_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
