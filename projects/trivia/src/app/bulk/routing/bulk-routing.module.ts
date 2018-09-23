import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { bulkRoutes } from './bulk.route';

@NgModule({
  imports: [
    RouterModule.forChild(bulkRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BulkRoutingModule { }
