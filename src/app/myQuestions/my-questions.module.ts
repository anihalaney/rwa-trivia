import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { MyQuestionsRoutingModule } from  './routing/my-questions-routing.module';

import { QuestionAddUpdateComponent, MyQuestionsComponent } from './components';

@NgModule({
  declarations: [
    QuestionAddUpdateComponent, MyQuestionsComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    MyQuestionsRoutingModule
  ],
  providers: [ 
  ]
})
export class MyQuestionsModule { }
