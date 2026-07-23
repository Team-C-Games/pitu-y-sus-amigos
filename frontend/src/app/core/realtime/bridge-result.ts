import { RealtimeEnvelope } from './realtime-envelope';

/** Respuesta directa a un comando SignalR, además de los eventos emitidos. */
export interface BridgeResult {
  readonly envelopes: readonly RealtimeEnvelope[];
}
