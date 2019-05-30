import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { QuestionActions, coreState } from 'shared-library/core/store';
import { AppState } from '../../../store';
import { MyQuestions } from './my-questions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatSnackBar } from '@angular/material';
import { Question } from 'shared-library/shared/model';

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
    public snackBar: MatSnackBar,
    public cd: ChangeDetectorRef,
  ) {
    super(store, questionActions, cd);

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.updateQuestion)).subscribe(status => {
      if (status === 'UPDATE') {
        this.snackBar.open('Question Updated!', '', { duration: 1500 });
      }
    }));

  }

  updateUnpublishedQuestions(question: Question) {
    this.store.dispatch(this.questionActions.updateQuestion(question));
  }


  ngOnDestroy() {
  }

}
