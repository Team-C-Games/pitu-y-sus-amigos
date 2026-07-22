import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyPageComponent } from './components/lobby-page/lobby-page.component';

@NgModule({
  declarations: [LobbyPageComponent],
  imports: [
    CommonModule,
    LobbyRoutingModule
  ]
})
export class LobbyModule {}
