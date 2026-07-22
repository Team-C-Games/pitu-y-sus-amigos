import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { provideGameRealtime } from './core/realtime/game-realtime.config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideGameRealtime({
      hubUrl: environment.hubUrl,
      reconnectDelaysMs: [0, 1_000, 3_000],
    }),
  ]
};
