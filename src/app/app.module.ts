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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {CategoryActions, TagActions, QuestionActions} from './store/actions';
import {CategoryEffects, TagEffects, QuestionEffects} from './store/effects';
import { default as reducer } from './store/app-store';


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
    FlexLayoutModule.forRoot(),

    //store
    StoreModule.provideStore(reducer),
    
    //ngrx effects
    EffectsModule.run(CategoryEffects),
    EffectsModule.run(TagEffects),
    EffectsModule.run(QuestionEffects)

  ],
  providers: [ 
    CategoryService, TagService, QuestionService,
    CategoryActions, TagActions, QuestionActions

  ],                                                                      
  bootstrap: [AppComponent]
})
export class AppModule { }
