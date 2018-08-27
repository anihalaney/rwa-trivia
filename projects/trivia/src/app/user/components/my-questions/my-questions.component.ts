import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from '../../../../../../shared-library/src/lib/core/store';
import { User, Question, QuestionStatus, Category } from '../../../../../../shared-library/src/lib/shared/model';
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

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions) {
    this.categoryDictObs = store.select(categoryDictionary);
  }

  ngOnInit() {
    this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    });
    this.publishedQuestions$ = this.store.select(userState).pipe(select(s => s.userPublishedQuestions));
    this.unpublishedQuestions$ = this.store.select(userState).pipe(select(s => s.userUnpublishedQuestions));
  }

  ngOnDestroy() {
  }

}
