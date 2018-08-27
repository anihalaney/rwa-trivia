import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared-library/src/lib/shared/shared.module';
import { BulkModule } from '../bulk/bulk.module';
import { AdminRoutingModule } from './routing/admin-routing.module';
import { effects, reducer } from './store';

import {
  DashboardComponent,
  AdminComponent,
  CategoriesComponent, TagsComponent,
  AdminQuestionsComponent
} from './components';
import { BulkComponent } from './components/bulk/bulk.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CategoriesComponent, TagsComponent,
    AdminQuestionsComponent,
    BulkComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    BulkModule,

    //ngrx feature store
    StoreModule.forFeature('admin', reducer),

    //  //ngrx effects
    EffectsModule.forFeature(effects),
  ]
})
export class AdminModule { }
