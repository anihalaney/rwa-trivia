import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { sharedRoutes } from './shared.route';

@NgModule({
  imports: [
    RouterModule.forChild(sharedRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SharedRoutingModule { }
