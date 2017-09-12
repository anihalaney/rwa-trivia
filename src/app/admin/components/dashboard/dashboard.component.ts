import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { QuestionActions } from '../../../core/store/actions';
import { Category, Question, SearchResults } from '../../../model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  categoriesObs: Observable<Category[]>;
  categoryDictObs: Observable<{[key: number] :Category}>;
  tagsObs: Observable<string[]>;
  questionsSearchResultsObs: Observable<SearchResults>;
  sampleQuestionsObs: Observable<Question[]>;

  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.tagsObs = store.select(s => s.tags);
    this.questionsSearchResultsObs = store.select(s => s.questionsSearchResults);
    this.sampleQuestionsObs = store.select(s => s.sampleQuestions);
  }

  ngOnInit() {
    this.store.dispatch(this.questionActions.loadSampleQuestions());
  }

  ngOnDestroy() {
  }
}
