import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideGameRealtime } from './core/realtime/game-realtime.config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideGameRealtime({
      hubUrl: 'http://localhost:5291/hubs/game',
      reconnectDelaysMs: [0, 1_000, 3_000],
    }),
  ]
};
