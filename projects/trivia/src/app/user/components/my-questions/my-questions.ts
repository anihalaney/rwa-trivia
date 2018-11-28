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

  publishedQuestions$: Observable<Question[]>;
  unpublishedQuestions$: Observable<Question[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;

  user: User;
  publishedQuestions: Question[];
  unpublishedQuestions: Question[];

  subs: Subscription[] = [];

  constructor(public store: Store<AppState>,
    public questionActions: QuestionActions,
    public utils: Utils) {
    this.categoryDictObs = store.select(categoryDictionary);

    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));
    this.publishedQuestions$ = this.store.select(userState).pipe(select(s => s.userPublishedQuestions));
    this.unpublishedQuestions$ = this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions));
  }
}
