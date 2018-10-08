import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { statsRoutes } from './stats.route';

@NgModule({
  imports: [
    RouterModule.forChild(statsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class StatsRoutingModule { }
