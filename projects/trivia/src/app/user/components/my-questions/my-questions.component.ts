import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { AppState } from '../../../store';
import { MyQuestions } from './my-questions';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})

export class MyQuestionsComponent extends MyQuestions implements OnDestroy {

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
  ) {
    super(store, questionActions);
  }

  ngOnDestroy() {
  }

}
