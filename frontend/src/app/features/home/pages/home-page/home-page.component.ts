import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameFacade } from '../../../../core/facade';

type HomeAction = 'create' | 'join' | 'spectate';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  private readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  protected readonly playerName = signal('');
  protected readonly action = signal<HomeAction>('create');

  protected readonly needsName = computed(() => this.action() !== 'spectate');

  protected readonly canSubmit = computed(() => {
    const hasName = this.playerName().trim().length >= 2;
    switch (this.action()) {
      case 'create':
        return hasName;
      case 'join':
        return hasName;
      case 'spectate':
        return true;
    }
  });

  protected readonly submitLabel = computed(() => {
    switch (this.action()) {
      case 'create':
        return 'Crear partida';
      case 'join':
        return 'Unirse a la partida';
      case 'spectate':
        return 'Espectar partida';
    }
  });

  protected onNameInput(event: Event): void {
    this.playerName.set((event.target as HTMLInputElement).value);
  }

  protected selectAction(action: HomeAction): void {
    this.action.set(action);
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
    const name = this.playerName().trim();

    switch (this.action()) {
      case 'create':
        if (await this.facade.createGame(name)) void this.router.navigate(['/lobby']);
        break;
      case 'join':
        if (await this.facade.joinGame(name)) void this.router.navigate(['/lobby']);
        break;
      case 'spectate':
        if (await this.facade.spectate()) void this.router.navigate(['/spectator']);
        break;
    }
  }
}
