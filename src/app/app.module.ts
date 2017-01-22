import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routes }   from './app.route';
import { AppComponent, CategoriesComponent, TagsComponent, QuestionsComponent } from './components';
import { CategoryService, TagService, QuestionService } from './services';

@NgModule({
  declarations: [
    AppComponent, CategoriesComponent, TagsComponent, QuestionsComponent
  ],
  imports: [
    BrowserModule,
    // Router
    RouterModule.forRoot(routes), 
    FormsModule,
    HttpModule
  ],
  providers: [ 
    CategoryService, TagService, QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
