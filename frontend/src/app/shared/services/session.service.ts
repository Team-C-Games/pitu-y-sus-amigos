import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly playerNameSignal = signal<string | null>(null);

  readonly playerName = this.playerNameSignal.asReadonly();

  setPlayerName(name: string): void {
    this.playerNameSignal.set(name.trim());
  }

  clearPlayerName(): void {
    this.playerNameSignal.set(null);
  }
}
