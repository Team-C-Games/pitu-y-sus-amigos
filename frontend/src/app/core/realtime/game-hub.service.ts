import { Injectable, OnDestroy, inject } from '@angular/core';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  GAME_HUB_CONNECTION_FACTORY,
  GAME_REALTIME_CONFIG,
} from './game-realtime.config';
import { RealtimeCommand } from './realtime-command';
import { RealtimeEnvelope } from './realtime-envelope';

const GameEventName = 'game-event';
const GetStateMethodName = 'GetState';
const DispatchMethodName = 'Dispatch';

@Injectable({ providedIn: 'root' })
export class GameHubService implements OnDestroy {
  private readonly config = inject(GAME_REALTIME_CONFIG);
  private readonly connectionFactory = inject(GAME_HUB_CONNECTION_FACTORY);
  private readonly eventsSubject = new Subject<RealtimeEnvelope>();
  private readonly connectionStateSubject = new BehaviorSubject<HubConnectionState>(
    HubConnectionState.Disconnected
  );
  private readonly errorsSubject = new Subject<Error>();

  private connection?: HubConnection;
  private connectPromise?: Promise<void>;

  readonly events$: Observable<RealtimeEnvelope> = this.eventsSubject.asObservable();
  readonly connectionState$: Observable<HubConnectionState> =
    this.connectionStateSubject.asObservable();
  readonly errors$: Observable<Error> = this.errorsSubject.asObservable();

  async connect(): Promise<void> {
    const connection = this.getOrCreateConnection();

    if (connection.state === HubConnectionState.Connected) {
      return;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = connection
      .start()
      .then(() => this.connectionStateSubject.next(connection.state))
      .catch((error: unknown) => {
        this.connectionStateSubject.next(HubConnectionState.Disconnected);
        this.errorsSubject.next(toError(error));
        throw error;
      })
      .finally(() => {
        this.connectPromise = undefined;
      });

    return this.connectPromise;
  }

  async disconnect(): Promise<void> {
    const connection = this.connection;
    if (!connection) {
      return;
    }

    try {
      if (this.connectPromise) {
        await this.connectPromise.catch(() => undefined);
      }

      connection.off(GameEventName, this.handleGameEvent);

      if (connection.state !== HubConnectionState.Disconnected) {
        await connection.stop();
      }
    } catch (error: unknown) {
      this.errorsSubject.next(toError(error));
      throw error;
    } finally {
      this.connection = undefined;
      this.connectionStateSubject.next(HubConnectionState.Disconnected);
    }
  }

  async getState(): Promise<void> {
    await this.requireConnection().invoke(GetStateMethodName);
  }

  async dispatch(command: RealtimeCommand): Promise<void> {
    await this.requireConnection().invoke(DispatchMethodName, command);
  }

  ngOnDestroy(): void {
    void this.disconnect();
    this.eventsSubject.complete();
    this.connectionStateSubject.complete();
    this.errorsSubject.complete();
  }

  private getOrCreateConnection(): HubConnection {
    if (this.connection) {
      return this.connection;
    }

    const connection = this.connectionFactory(this.config);
    connection.on(GameEventName, this.handleGameEvent);
    connection.onreconnecting((error?: Error) => {
      this.connectionStateSubject.next(HubConnectionState.Reconnecting);

      if (error) {
        this.errorsSubject.next(error);
      }
    });
    connection.onreconnected(() => {
      this.connectionStateSubject.next(HubConnectionState.Connected);
    });
    connection.onclose((error?: Error) => {
      this.connectionStateSubject.next(HubConnectionState.Disconnected);

      if (error) {
        this.errorsSubject.next(error);
      }
    });

    this.connection = connection;
    return connection;
  }

  private requireConnection(): HubConnection {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      throw new Error('The game hub is not connected.');
    }

    return this.connection;
  }

  private readonly handleGameEvent = (envelope: unknown): void => {
    if (!isRealtimeEnvelope(envelope)) {
      this.errorsSubject.next(new Error('Received an invalid game-event envelope.'));
      return;
    }

    this.eventsSubject.next(envelope);
  };
}

function isRealtimeEnvelope(value: unknown): value is RealtimeEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const envelope = value as Record<string, unknown>;
  return (
    typeof envelope['type'] === 'string' &&
    'payload' in envelope &&
    typeof envelope['occurredAt'] === 'string'
  );
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('The game hub connection failed.');
}
