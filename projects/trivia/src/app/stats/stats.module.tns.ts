import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../../../shared-library/src/lib/shared/shared.module';
import { LeaderboardComponent, RealtimeStatsComponent } from './components';
import { LeaderBoardContainerComponent } from './components/mobile/leaderboard-container/leaderboard-container.component'
import { effects, reducer } from './store';
import {  MobileSharedModule } from './../mobile/shared';
@NgModule({
  declarations: [
    LeaderboardComponent,
    RealtimeStatsComponent,
    LeaderBoardContainerComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    //ngrx feature store
    StoreModule.forFeature('stats', reducer),
    //ngrx effects
    EffectsModule.forFeature(effects),
    MobileSharedModule
  ],
  providers: [
  ],
  exports: [
    LeaderboardComponent,
    RealtimeStatsComponent,
    LeaderBoardContainerComponent
  ]
})
export class StatsModule { }
