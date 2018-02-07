import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BulkRoutingModule } from './routing/bulk-routing.module';

import { BulkSummaryComponent, BulkDetailsComponent, BulkUploadComponent, BulkSummaryQuestionListComponent } from './components';

@NgModule({
  declarations: [
    BulkSummaryComponent,
    BulkDetailsComponent,
    BulkUploadComponent, BulkSummaryQuestionListComponent
  ],
  imports: [
    SharedModule,
    BulkRoutingModule
  ]
})
export class BulkModule { }
