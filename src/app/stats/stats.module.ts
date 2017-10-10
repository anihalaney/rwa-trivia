import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { 
  LeaderboardComponent, 
  RealtimeStatsComponent } from  './components';

@NgModule({
  declarations: [
    LeaderboardComponent, 
    RealtimeStatsComponent
  ],
  imports: [
    //rwa modules
    SharedModule
  ],
  providers: [ 
  ],                                                                      
  exports:  [ 
    LeaderboardComponent, 
    RealtimeStatsComponent
  ]
})
export class StatsModule { }
