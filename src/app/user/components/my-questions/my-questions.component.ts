import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState, appState, categoryDictionary } from '../../../store';
import { QuestionActions } from '../../../core/store';
import { User, Question, QuestionStatus, Category }     from '../../../model';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})
export class MyQuestionsComponent implements OnInit, OnDestroy {
  publishedQuestions$: Observable<Question[]>;
  unpublishedQuestions$: Observable<Question[]>;
  categoryDictObs: Observable<{[key: number]: Category}>;
  user: User;

  publishedQuestions: Question[];
  unpublishedQuestions: Question[];
  
  constructor(private store: Store<AppState>,
              private questionActions: QuestionActions) {
    this.publishedQuestions$ = store.select(appState.coreState).select(s => s.userPublishedQuestions);
    this.unpublishedQuestions$ = store.select(appState.coreState).select(s => s.userUnpublishedQuestions);
    this.categoryDictObs = store.select(categoryDictionary);
  }

  ngOnInit() {
    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user);
    this.store.dispatch(this.questionActions.loadUserPublishedQuestions(this.user));
    this.store.dispatch(this.questionActions.loadUserUnpublishedQuestions(this.user));
  }

  ngOnDestroy() {
  }

}
