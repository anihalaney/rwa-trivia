import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { BulkRoutingModule } from './routing/bulk-routing.module';
import { effects, reducer } from './store';

import { BulkDetailsComponent, BulkUploadComponent, BulkSummaryComponent } from './components';


@NgModule({
  declarations: [
    BulkDetailsComponent,
    BulkUploadComponent,
    BulkSummaryComponent
  ],
  imports: [
    SharedModule,
    BulkRoutingModule,

     //ngrx feature store
     StoreModule.forFeature('bulk', reducer),

    //  //ngrx effects
     EffectsModule.forFeature(effects),
  ]
})
export class BulkModule { }
