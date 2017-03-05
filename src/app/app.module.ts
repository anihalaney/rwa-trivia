import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';

import { routes }   from './app.route';

import { CoreModule } from './core/core.module';
import { SharedModule } from  './shared/shared.module';

import { AppComponent, DashboardComponent,
         AdminComponent,
         CategoriesComponent, TagsComponent, 
         QuestionAddUpdateComponent, MyQuestionsComponent, AdminQuestionsComponent } from './components';

@NgModule({
  declarations: [
    AppComponent, DashboardComponent,
    AdminComponent,
    CategoriesComponent, TagsComponent, 
    QuestionAddUpdateComponent, MyQuestionsComponent, AdminQuestionsComponent
  ],
  imports: [
    BrowserModule,

    // Router
    RouterModule.forRoot(routes), 

    //rwa modules
    CoreModule,
    SharedModule
  ],
  providers: [ 
  ],                                                                      
  bootstrap: [AppComponent]
})
export class AppModule { }
