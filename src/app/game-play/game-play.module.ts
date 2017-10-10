import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { GamePlayRoutingModule } from  './routing/game-play-routing.module';
import { NewGameComponent, GameComponent, 
         GameQuestionComponent, GameQuestionContinueComponent,
         GameOverComponent, GameDialogComponent } from  './components';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameQuestionComponent,
    GameQuestionContinueComponent,
    GameOverComponent,
    GameDialogComponent
  ],
  entryComponents: [
    GameDialogComponent
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
