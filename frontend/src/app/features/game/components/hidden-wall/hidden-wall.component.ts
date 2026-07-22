import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hidden-wall',
  templateUrl: './hidden-wall.component.html',
  styleUrls: ['./hidden-wall.component.scss'],
  imports: [
    CommonModule
  ]
})
export class HiddenWallComponent {
  @Input() visible!: boolean;
}
