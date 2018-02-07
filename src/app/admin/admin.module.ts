import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './routing/admin-routing.module';

import { DashboardComponent,
         AdminComponent,
         CategoriesComponent, TagsComponent,
         AdminQuestionsComponent } from './components';
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
    AdminRoutingModule
  ]
})
export class AdminModule { }
