import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import {
  NewGameComponent, GameComponent,
  GameQuestionComponent, GameQuestionContinueComponent,
  GameOverComponent, GameDialogComponent, ReportGameComponent, GameContinueComponent
} from './components';
import { effects, reducer } from './store';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent,
    GameQuestionComponent,
    GameQuestionContinueComponent,
    GameOverComponent,
    GameDialogComponent,
    ReportGameComponent,
    GameContinueComponent
  ],
  entryComponents: [
    GameDialogComponent,
    ReportGameComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    GamePlayRoutingModule,
    MatSnackBarModule,
    //ngrx feature store
    StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

    SwiperModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class GamePlayModule { }
