import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { AppState } from '../../../store';
import { MyQuestions } from './my-questions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class MyQuestionsComponent extends MyQuestions implements OnDestroy {

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public cd: ChangeDetectorRef
  ) {
    super(store, questionActions, cd);
  }

  ngOnDestroy() {
  }

}
