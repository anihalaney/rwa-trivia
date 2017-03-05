import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { AdminRoutingModule } from  './routing/admin-routing.module';

import { DashboardComponent,
         AdminComponent,
         CategoriesComponent, TagsComponent, 
         AdminQuestionsComponent } from './components';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    CategoriesComponent, TagsComponent,
    AdminQuestionsComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
