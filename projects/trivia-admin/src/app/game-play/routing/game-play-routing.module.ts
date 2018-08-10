import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';

import { gamePlayRoutes }   from './game-play.route';

@NgModule({
  imports: [
    RouterModule.forChild(gamePlayRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GamePlayRoutingModule { }
