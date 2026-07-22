export interface RealtimeEnvelope {
  readonly type: string;
  readonly payload: unknown;
  readonly occurredAt: string;
}
