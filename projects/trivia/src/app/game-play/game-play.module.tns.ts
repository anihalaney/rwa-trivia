import { NgModule } from '@angular/core';
// import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';

import {
  NewGameComponent
} from './components';

@NgModule({
  declarations: [
    NewGameComponent
  ],
  entryComponents: [
  ],
  imports: [
    //rwa modules
    // SharedModule,
    GamePlayRoutingModule,

    //ngrx feature store
    // StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
    // EffectsModule.forFeature(effects),

  ],
  providers: [
  ]
})
export class GamePlayModule { }
