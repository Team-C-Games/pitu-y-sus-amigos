import { Component, input } from '@angular/core';
import { WallVisual } from '../models';

@Component({
  selector: 'app-wall',
  standalone: true,
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss',
})
export class WallComponent {
  readonly wall = input.required<WallVisual>();
}
