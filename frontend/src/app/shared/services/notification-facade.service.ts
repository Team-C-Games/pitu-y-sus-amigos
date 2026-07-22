import { Injectable, computed, signal } from '@angular/core';

export type NotificationToastType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationToastEntry {
  readonly id: string;
  readonly message: string;
  readonly type: NotificationToastType;
  readonly duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly notificationsSignal = signal<NotificationToastEntry[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly activeNotification = computed(() => this.notificationsSignal()[0] ?? null);

  constructor() {
    setTimeout(() => {
      this.show('Partida lista para empezar', 'info', 2600);
      this.show('Turno confirmado', 'success', 3000);
      this.show('Revisa el tablero antes de avanzar', 'warning', 3200);
      this.show('El servidor respondió con un aviso', 'error', 3400);
    }, 300);
  }

  show(message: string, type: NotificationToastType = 'info', duration = 3000): void {
    const nextNotification: NotificationToastEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      type,
      duration,
    };

    this.notificationsSignal.update((currentQueue) => [...currentQueue, nextNotification]);
  }

  dismissCurrent(): void {
    this.notificationsSignal.update((currentQueue) => currentQueue.slice(1));
  }
}
