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
  criteria: SearchCriteria;

  constructor(private store: Store<AppStore>,
              private questionActions: QuestionActions) {
    this.questionsSearchResultsObs = store.select(s => s.questionsSearchResults);
    this.unpublishedQuestionsObs = store.select(s => s.unpublishedQuestions);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.criteria = new SearchCriteria();
  }

  ngOnInit() {
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": 0, "pageSize": 25, criteria: this.criteria}));
    this.store.dispatch(this.questionActions.loadUnpublishedQuestions());
    console.log(this.unpublishedQuestionsObs);
  }

  ngOnDestroy() {
  }

  approveQuestion(question: Question) {
    let user: User;

    this.store.take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;

    this.store.dispatch(this.questionActions.approveQuestion(question));
  }

  pageChanged(pageEvent: PageEvent) {
    let startRow = (pageEvent.pageIndex) * pageEvent.pageSize;
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": startRow, "pageSize": pageEvent.pageSize, criteria: this.criteria}));
  }
  categoryChanged(event: {categoryId: number, added: boolean}) {
    if (!this.criteria.categoryIds) {
      this.criteria.categoryIds = [];
    }

    if (event.added) {
      this.criteria.categoryIds.push(event.categoryId);
    }
    else {
      this.criteria.categoryIds = this.criteria.categoryIds.filter(c => c != event.categoryId);
    }

    this.searchCriteriaChange();
  }
  tagChanged(event: {tag: string, added: boolean}) {
    if (!this.criteria.tags) {
      this.criteria.tags = [];
    }

    if (event.added) {
      this.criteria.tags.push(event.tag);
    }
    else {
      this.criteria.tags = this.criteria.tags.filter(c => c != event.tag);
    }

    this.searchCriteriaChange();
  }
  sortOrderChanged(sortOrder: string) {
    this.criteria.sortOrder = sortOrder;
    this.searchCriteriaChange();
  }
  searchCriteriaChange() {
    //console.log(this.criteria);
    this.store.dispatch(this.questionActions.loadQuestions({"startRow": 0, "pageSize": 25, criteria: this.criteria}));
  }
}
