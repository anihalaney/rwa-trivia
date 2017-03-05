import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from  './shared/shared.module';
import { RoutingModule } from  './routing/routing.module';

import { AppComponent, DashboardComponent,
         QuestionAddUpdateComponent, MyQuestionsComponent } from './components';

@NgModule({
  declarations: [
    AppComponent, DashboardComponent,
    QuestionAddUpdateComponent, MyQuestionsComponent
  ],
  imports: [
    BrowserModule,

    //rwa modules
    CoreModule,
    SharedModule,
    RoutingModule
  ],
  providers: [ 
  ],                                                                      
  bootstrap: [AppComponent]
})
export class AppModule { }
