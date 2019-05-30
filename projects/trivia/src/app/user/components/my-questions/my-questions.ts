import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { QuestionActions } from 'shared-library/core/store';
import { Category, Question, User } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../store';
import { userState } from '../../../user/store';
import { ChangeDetectorRef } from '@angular/core';

export class MyQuestions {

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoriesObs: Observable<Category[]>;
  tagsObs: Observable<string[]>;
  user: User;
  loaderBusy = false;
  subscriptions = [];

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public cd: ChangeDetectorRef,
  ) {

    this.loaderBusy = true;
    // this.categoryDictObs = store.select(getCategories);
    // this.tags = store.select(getTags);

    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));

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
    this.cd.markForCheck();
  }

  // updateQuestionData(question: Question) {
  //   this.store.dispatch(new bulkActions.UpdateQuestion({ question: question }));
  // }

}
