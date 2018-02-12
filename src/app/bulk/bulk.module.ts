import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BulkRoutingModule } from './routing/bulk-routing.module';

import { BulkDetailsComponent, BulkUploadComponent, BulkSummaryComponent } from './components';


@NgModule({
  declarations: [
    BulkDetailsComponent,
    BulkUploadComponent,
    BulkSummaryComponent
  ],
  imports: [
    SharedModule,
    BulkRoutingModule
  ]
})
export class BulkModule { }
