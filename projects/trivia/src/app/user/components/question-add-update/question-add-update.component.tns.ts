import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { QuestionActions } from 'shared-library/core/store/actions/question.actions';
import { QuestionAddUpdate } from './question-add-update';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.css']
})

export class QuestionAddUpdateComponent extends QuestionAddUpdate implements OnDestroy {


  // Constructor
  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils,
    public questionAction: QuestionActions) {

    super(fb, store, utils, questionAction);

    this.subs.push(store.select(appState.coreState).pipe(select(s => s.questionSaveStatus)).subscribe((status) => {
      if (status === 'SUCCESS') {
        // this.snackBar.open('Question saved!', '', { duration: 2000 });
        // this.router.navigate(['/my/questions']);
        this.store.dispatch(this.questionAction.resetQuestionSuccess());
      }
    }));


  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
