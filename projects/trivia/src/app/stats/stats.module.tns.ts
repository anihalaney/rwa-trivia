import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { LeaderboardComponent, RealtimeStatsComponent } from './components';
import { effects, reducer } from './store';
import { StatsRoutingModule } from './routing/stats-routing.module';
@NgModule({
  declarations: [
    LeaderboardComponent,
    RealtimeStatsComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    //ngrx feature store
    StoreModule.forFeature('stats', reducer),
    //ngrx effects
    EffectsModule.forFeature(effects),
    StatsRoutingModule
  ],
  providers: [
  ],
  exports: [
    LeaderboardComponent,
    RealtimeStatsComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StatsModule { }
