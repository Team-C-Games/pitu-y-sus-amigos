export interface PlayerStatusVisual {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly points: number;
  readonly isActive: boolean;
  readonly isReady?: boolean;
  readonly isConnected?: boolean;
}
