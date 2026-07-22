import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export interface GameRealtimeConfig {
  readonly hubUrl: string;
  readonly reconnectDelaysMs: readonly number[];
}

export type GameHubConnectionFactory = (config: GameRealtimeConfig) => HubConnection;

export const GAME_REALTIME_CONFIG = new InjectionToken<GameRealtimeConfig>(
  'GAME_REALTIME_CONFIG'
);

export const GAME_HUB_CONNECTION_FACTORY = new InjectionToken<GameHubConnectionFactory>(
  'GAME_HUB_CONNECTION_FACTORY'
);

export function provideGameRealtime(config: GameRealtimeConfig): EnvironmentProviders {
  if (!config.hubUrl) {
    throw new Error('Game realtime hub URL is required.');
  }

  return makeEnvironmentProviders([
    {
      provide: GAME_REALTIME_CONFIG,
      useValue: config,
    },
    {
      provide: GAME_HUB_CONNECTION_FACTORY,
      useValue: createGameHubConnection,
    },
  ]);
}

function createGameHubConnection(config: GameRealtimeConfig): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(config.hubUrl)
    .withAutomaticReconnect([...config.reconnectDelaysMs])
    .build();
}
