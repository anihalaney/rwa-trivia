import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';

import { myQuestionsRoutes }   from './my-questions.route';

@NgModule({
  imports: [
    RouterModule.forChild(myQuestionsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MyQuestionsRoutingModule { }
