import { Component, OnInit, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GameFacade } from './core/facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly facade = inject(GameFacade);
  private readonly router = inject(Router);

  private readonly synchronizeRoute = effect(() => {
    const phase = this.facade.phase();
    if (phase === 'finished' && this.router.url !== '/game/over') void this.router.navigateByUrl('/game/over');
    if (phase === 'playing' && this.router.url === '/lobby') void this.router.navigateByUrl('/game');
    if (phase === 'home' && this.router.url !== '/') void this.router.navigateByUrl('/');
  });

  async ngOnInit(): Promise<void> {
    await this.facade.connect();
  }
}
