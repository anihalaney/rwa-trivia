import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import {PageEvent} from '@angular/material';
import { AppStore } from '../../../core/store/app-store';
import { QuestionActions } from '../../../core/store/actions';
import { User, Question, Category, SearchResults, SearchCriteria }     from '../../../model';

@Component({
  selector: 'admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.scss']
})
export class AdminQuestionsComponent implements OnInit, OnDestroy {
  questionsSearchResultsObs: Observable<SearchResults>;
  unpublishedQuestionsObs: Observable<Question[]>;
  categoryDictObs: Observable<{[key: number]: Category}>;

  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions) {
    this.questionsSearchResultsObs = store.select(s => s.questionsSearchResults);
    this.unpublishedQuestionsObs = store.select(s => s.unpublishedQuestions);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": 0, "pageSize": 25}));
    this.store.dispatch(this.questionActions.loadUnpublishedQuestions());
  }

  ngOnDestroy() {
  }

  approveQuestion(question: Question) {
    let user: User;

    this.store.take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;

    this.store.dispatch(this.questionActions.approveQuestion(question));
  }

  pageChange(pageEvent: PageEvent) {
    let startRow = (pageEvent.pageIndex) * pageEvent.pageSize;
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": startRow, "pageSize": pageEvent.pageSize}));
  }
  searchCriteriaChange(criteria: SearchCriteria) {
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": 0, "pageSize": 25}));
  }
}
