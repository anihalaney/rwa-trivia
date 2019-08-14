import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import {
  ReportGameComponent, NewGameComponent, GameComponent, GameDialogComponent, GameQuestionComponent, GameOverComponent, GameContinueComponent
} from './components';
import { effects, reducer } from './store';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { CoreModule } from 'shared-library/core/core.module';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameDialogComponent,
    GameQuestionComponent,
    GameOverComponent,
    ReportGameComponent,
    GameContinueComponent

  ],
  imports: [
    // rwa modules
    SharedModule,
    CoreModule,
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
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GamePlayModule { }
