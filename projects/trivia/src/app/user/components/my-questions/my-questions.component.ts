import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store';
import { User, Question, QuestionStatus, Category } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { userState } from '../../../user/store';
import * as userActions from '../../store/actions';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})
export class MyQuestionsComponent implements OnInit, OnDestroy {

  publishedQuestions$: Observable<Question[]>;
  unpublishedQuestions$: Observable<Question[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;

  user: User;
  publishedQuestions: Question[];
  unpublishedQuestions: Question[];

  subs: Subscription[] = [];

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions,
    private utils: Utils) {
    this.categoryDictObs = store.select(categoryDictionary);
  }

  ngOnInit() {
    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));
    this.publishedQuestions$ = this.store.select(userState).pipe(select(s => s.userPublishedQuestions));
    this.unpublishedQuestions$ = this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
