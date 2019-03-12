import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { effects, reducer } from './store';
import { SharedModule } from 'shared-library/shared/shared.module';
import { DashboardRoutingModule } from './routing/dashboard-routing.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { GameCardComponent } from './component/game-card/game-card.component';
import { NewsletterComponent } from './component/newsletter/newsletter.component';
import { BlogComponent } from './component/blog/blog.component';
import { effects, reducer } from './store';

@NgModule({
  declarations: [
    DashboardComponent,
    GameCardComponent,
    BlogComponent,
    NewsletterComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    StoreModule.forFeature('dashboard', reducer),
    EffectsModule.forFeature(effects),
  ],
  providers: [],
  exports: [],
  entryComponents: [
  ]
})

export class DashboardModule { }
