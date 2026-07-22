import { Injectable, Signal, computed, signal } from '@angular/core';
import { BoardVisualState } from '../board/models';
import { DiceVisual, TreasureVisual } from '../hud/models';
import { SidePanelPlayer } from '../components/side-panel/side-panel.component';
import { GamePhase, GameUiState, PlayerMode, TurnState, UiOverlay } from '../models';

@Injectable({ providedIn: 'root' })
export class MockGameProvider {
  readonly boardVisualState = signal<BoardVisualState>(this.createBoardVisualState());
  readonly players = signal<SidePanelPlayer[]>([
    { id: '1', name: 'Jugador 1', isReady: true, isCurrentTurn: false },
    { id: '2', name: 'Jugador 2', isReady: true, isCurrentTurn: true },
    { id: '3', name: 'Jugador 3', isReady: false, isCurrentTurn: false },
  ]);
  readonly currentTurnPlayer = signal<SidePanelPlayer | undefined>({
    id: '2',
    name: 'Jugador 2',
    isReady: true,
    isCurrentTurn: true,
  });
  readonly readyPlayers = signal<SidePanelPlayer[]>([
    { id: '1', name: 'Jugador 1', isReady: true, isCurrentTurn: false },
    { id: '2', name: 'Jugador 2', isReady: true, isCurrentTurn: true },
  ]);
  readonly spectators = signal<string[]>(['Espectador 1', 'Espectador 2']);
  readonly treasuresFound = signal<number>(3);
  readonly currentPlayer = signal({
    playerName: 'Jugador 1',
    playerAvatar: 'placeholder.png',
    treasureCount: 3,
  });
  readonly treasure = signal<TreasureVisual>({
    id: 'forest-treasure',
    label: 'Tesoro del bosque',
    visual: '◇',
  });
  readonly dice = signal<DiceVisual>({
    value: 4,
    isAvailable: true,
  });
  readonly winner = signal<string>('Jugador 2');
  readonly ranking = signal<string[]>(['1. Jugador 2', '2. Jugador 1', '3. Jugador 3']);
  readonly uiState = signal<GameUiState>({
    gamePhase: 'playing',
    playerMode: 'player',
    turnState: 'myTurn',
    overlays: 'none',
  });

  readonly isPlayerMode = computed(() => this.uiState().playerMode === 'player');
  readonly turnState: Signal<TurnState> = computed(() => this.uiState().turnState);

  private createBoardVisualState(): BoardVisualState {
    const cells = Array.from({ length: 36 }, (_, index) => {
      const row = Math.floor(index / 6);
      const column = index % 6;

      return {
        position: { row, column },
        label: `${String.fromCharCode(65 + row)}${column + 1}`,
        emphasized: row === 2 && column === 2,
      };
    });

    return {
      cells,
      pieces: [
        { color: '#f59e0b', label: 'P1' },
        { color: '#60a5fa', label: 'P2' },
      ],
      walls: [
        { position: { row: 1, column: 2 }, orientation: 'vertical' },
        { position: { row: 3, column: 4 }, orientation: 'horizontal' },
      ],
      animations: ['🎯 turno activo', '🪙 tesoro descubierto'],
      selection: { row: 2, column: 2 },
    };
  }
}
