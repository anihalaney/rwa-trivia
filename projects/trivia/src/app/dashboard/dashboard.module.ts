import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { effects, reducer } from './store';
import { SharedModule } from 'shared-library/shared/shared.module';
import { DashboardRoutingModule } from './routing/dashboard-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { GameCardComponent } from './component/game-card/game-card.component';
@NgModule({
  declarations: [
    DashboardComponent,
    GameCardComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  providers: [],
  exports: [],
  entryComponents: [
  ]
})

export class DashboardModule { }
