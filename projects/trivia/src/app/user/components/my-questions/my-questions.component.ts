import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { coreState, QuestionActions } from 'shared-library/core/store';
import { Question } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { MyQuestions } from './my-questions';

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
