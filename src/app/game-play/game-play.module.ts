import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { GamePlayRoutingModule } from  './routing/game-play-routing.module';
import { NewGameComponent, GameComponent, GameQuestionComponent } from  './components';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameQuestionComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    GamePlayRoutingModule
  ],
  providers: [ 
  ]
})
export class GamePlayModule { }
