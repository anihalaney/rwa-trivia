import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import {
  ReportGameComponent, NewGameComponent, GameComponent, GameDialogComponent, GameQuestionComponent, GameOverComponent
} from './components';
import { effects, reducer } from './store';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameDialogComponent,
    GameQuestionComponent,
    GameOverComponent,
    ReportGameComponent
  ],
  imports: [
    // rwa modules
    SharedModule,
    GamePlayRoutingModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    //ngrx feature store
    StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

  ],
  entryComponents: [ReportGameComponent],
  providers: [
  ]
})
export class GamePlayModule { }
