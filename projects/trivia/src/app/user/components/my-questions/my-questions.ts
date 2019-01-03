import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { User, Question, QuestionStatus, Category } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { userState } from '../../../user/store';
import * as userActions from '../../store/actions';

export class MyQuestions {

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  categoryDictObs: Observable<{ [key: number]: Category }>;
  user: User;
  loaderBusy = false;

  subs: Subscription[] = [];

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public utils: Utils) {

    this.loaderBusy = true;
    this.categoryDictObs = store.select(categoryDictionary);

    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));
    this.subs.push(this.store.select(userState).pipe(select(s => s.userPublishedQuestions)).subscribe((questions) => {
      this.publishedQuestions = questions;
      this.hideLoader();
    }));
    this.subs.push(this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions)).subscribe((questions) => {
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
}
