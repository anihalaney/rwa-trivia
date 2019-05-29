import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { QuestionActions, tags } from 'shared-library/core/store';
import { User, Question, QuestionStatus, Category } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary, getTags , getCategories} from '../../../store';
import { userState } from '../../../user/store';
import * as userActions from '../../store/actions';
import { ChangeDetectorRef } from '@angular/core';
import * as bulkActions from '../../../bulk/store/actions';
export class MyQuestions {

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  categoryDictObs: Observable<{ [key: number]: Category }>;
  tags: Observable<{ [key: number]: string }>;
  user: User;
  loaderBusy = false;
  subscriptions = [];

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public cd: ChangeDetectorRef
  ) {

    this.loaderBusy = true;
    this.categoryDictObs = store.select(getCategories);
    this.tags = store.select(getTags);

    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));
    this.subscriptions.push(this.store.select(userState).pipe(select(s => s.userPublishedQuestions)).subscribe((questions) => {
      this.publishedQuestions = questions;
      this.hideLoader();
    }));
    this.subscriptions.push(this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions)).subscribe((questions) => {
      this.unpublishedQuestions = questions;
      this.hideLoader();
    }));
  }

  hideLoader() {
    if (this.publishedQuestions && this.unpublishedQuestions) {
      setTimeout(() => {
        this.toggleLoader(false);
      }, 1000);
    }
  }


  toggleLoader(flag: boolean) {
    this.loaderBusy = flag;
  }

  updateQuestionData(question: Question) {
    this.store.dispatch(new bulkActions.UpdateQuestion({ question: question }));
  }

}
