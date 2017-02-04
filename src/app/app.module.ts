import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'hammerjs';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { routes }   from './app.route';
import { AppComponent, CategoriesComponent, TagsComponent, 
         QuestionsComponent, QuestionAddUpdateComponent } from './components';
import { CategoryService, TagService, QuestionService } from './services';

@NgModule({
  declarations: [
    AppComponent, CategoriesComponent, TagsComponent, 
    QuestionsComponent, QuestionAddUpdateComponent
  ],
  imports: [
    BrowserModule,
    // Router
    RouterModule.forRoot(routes), 
    // Forms
    FormsModule,
    ReactiveFormsModule, 
    HttpModule,

    //Material
    MaterialModule.forRoot(),
    //Flex
    FlexLayoutModule.forRoot()
  ],
  providers: [ 
    CategoryService, TagService, QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
