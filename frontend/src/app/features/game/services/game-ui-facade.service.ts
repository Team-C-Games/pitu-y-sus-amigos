import { Injectable, Signal, computed, signal } from '@angular/core';
import { GameUiState } from '../models';

@Injectable({ providedIn: 'root' })
export class GameUiFacade {
  private readonly uiStateSignal = signal<GameUiState>({
    gamePhase: 'playing',
    playerMode: 'player',
    turnState: 'myTurn',
    overlays: 'none',
  });

  readonly state: Signal<GameUiState> = this.uiStateSignal.asReadonly();

  readonly isPlaying = computed(() => this.state().gamePhase === 'playing');
  readonly isLobby = computed(() => this.state().gamePhase === 'lobby');
  readonly isFinished = computed(() => this.state().gamePhase === 'finished');
  readonly isMyTurn = computed(() => this.state().turnState === 'myTurn');
  readonly isWaitingTurn = computed(() => this.state().turnState === 'waiting');
  readonly isSpectator = computed(() => this.state().playerMode === 'spectator');
  readonly showLoading = computed(() => this.state().overlays === 'loading');
}
