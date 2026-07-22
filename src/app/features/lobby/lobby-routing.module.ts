import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyPageComponent } from './components/lobby-page/lobby-page.component';

const routes: Routes = [
  {
    path: '',
    component: LobbyPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule {}
