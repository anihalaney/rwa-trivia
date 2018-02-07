import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { BulkRoutingModule } from  './routing/bulk-routing.module';

import { BulkSummaryComponent, BulkDetailsComponent, BulkUploadComponent } from './components';
import { BulkSummaryQuestionListComponent } from './components/bulk-summary/bulk-summary-question-list/bulk-summary-question-list.component';

@NgModule({
  declarations: [
    BulkSummaryComponent, 
    BulkDetailsComponent, 
    BulkUploadComponent, BulkSummaryQuestionListComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    BulkRoutingModule
  ]
})
export class BulkModule { }
