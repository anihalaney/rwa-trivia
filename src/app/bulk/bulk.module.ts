import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { BulkRoutingModule } from  './routing/bulk-routing.module';

import { BulkSummaryComponent, BulkDetailsComponent, BulkUploadComponent } from './components';

@NgModule({
  declarations: [
    BulkSummaryComponent, 
    BulkDetailsComponent, 
    BulkUploadComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    BulkRoutingModule
  ]
})
export class BulkModule { }
