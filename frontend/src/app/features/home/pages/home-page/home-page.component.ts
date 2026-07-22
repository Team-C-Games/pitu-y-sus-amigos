import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'], 
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HomePageComponent {
  constructor(private router: Router) {}

  navigateToLobby(): void {
    this.router.navigate(['/lobby']);
  }

  navigateToSpectator(): void {
    this.router.navigate(['/spectator']);
  }
}
