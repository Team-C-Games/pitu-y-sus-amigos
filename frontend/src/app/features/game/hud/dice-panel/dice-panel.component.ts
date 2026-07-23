import { Component, computed, input, output } from '@angular/core';
import { DiceVisual } from '../models';

/**
 * Dado mágico. El valor indica el máximo de pasos: el jugador puede
 * avanzar menos casilleros si lo prefiere.
 */
@Component({
  selector: 'app-dice-panel',
  templateUrl: './dice-panel.component.html',
  styleUrl: './dice-panel.component.scss',
})
export class DicePanelComponent {
  readonly dice = input<DiceVisual | null>(null);
  readonly rollRequested = output<void>();

  protected readonly value = computed(() => this.dice()?.value ?? null);
  protected readonly isRolling = computed(() => this.dice()?.isRolling ?? false);
  protected readonly canRoll = computed(
    () => (this.dice()?.isAvailable ?? false) && !this.isRolling()
  );
}
