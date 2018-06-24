import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { PageEvent } from '@angular/material';
import { AppState, appState, categoryDictionary } from '../../../store/app-store';
import { User, Question, Category, SearchResults, SearchCriteria } from '../../../model';

import { adminState } from '../../store';
import * as adminActions from '../../store/actions';
import { Router } from '@angular/router';
import { UserActions } from '../../../core/store/actions';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.scss']
})

export class AdminQuestionsComponent implements OnInit {
  questionsSearchResultsObs: Observable<SearchResults>;
  unpublishedQuestionsObs: Observable<Question[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;
  criteria: SearchCriteria;
  toggleValue: boolean;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  selectedTab = 0;

  constructor(private store: Store<AppState>, private router: Router, private userActions: UserActions) {

    this.questionsSearchResultsObs = this.store.select(adminState).select(s => s.questionsSearchResults);
    this.unpublishedQuestionsObs = this.store.select(adminState).select(s => s.unpublishedQuestions).map((question) => {
      const questionList = question;
      if (questionList) {
        questionList.map((q) => {
          if (this.userDict[q.created_uid] === undefined) {
            this.store.dispatch(this.userActions.loadOtherUserProfile(q.created_uid));
          }
        });
      }

      return questionList;
    });

    this.userDict$ = store.select(appState.coreState).select(s => s.userDict);
    this.userDict$.subscribe(userDict => this.userDict = userDict);


    this.categoryDictObs = store.select(categoryDictionary);
    this.criteria = new SearchCriteria();

    const url = this.router.url;
    this.toggleValue = url.includes('bulk') ? true : false;

    this.store.select(adminState).select(s => s.getQuestionToggleState).subscribe((stat) => {
      if (stat != null) {
        this.selectedTab = stat === 'Published' ? 0 : 1
      }
    });
    this.store.select(adminState).select(s => s.getArchiveToggleState).subscribe((state) => {
      if (state != null) {
        this.toggleValue = state;
        (this.toggleValue) ? this.router.navigate(['admin/questions/bulk-questions']) : this.router.navigate(['/admin/questions']);
      } else {
        this.toggleValue = false;
        this.router.navigate(['/admin/questions']);
      }
    });
  }

  ngOnInit() {
    // this.store.dispatch(new adminActions.SaveQuestionToggleState
    //   ({ toggle_state: 'Published' }));
  }

  approveQuestion(question: Question) {
    let user: User;

    this.store.select(appState.coreState).take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;
    this.store.dispatch(new adminActions.LoadUnpublishedQuestions({ 'question_flag': this.toggleValue }));
    this.store.dispatch(new adminActions.ApproveQuestion({ question: question }));

  }

  pageChanged(pageEvent: PageEvent) {
    const startRow = (pageEvent.pageIndex) * pageEvent.pageSize;

    this.store.dispatch(new adminActions.LoadQuestions({
      'startRow': startRow,
      'pageSize': pageEvent.pageSize, criteria: this.criteria
    }));
  }

  categoryChanged(event: { categoryId: number, added: boolean }) {
    if (!this.criteria.categoryIds) {
      this.criteria.categoryIds = [];
    }

    if (event.added) {
      this.criteria.categoryIds.push(event.categoryId);
    } else {
      this.criteria.categoryIds = this.criteria.categoryIds.filter(c => c !== event.categoryId);
    }

    this.searchCriteriaChange();
  }
  tagChanged(event: { tag: string, added: boolean }) {
    if (!this.criteria.tags) {
      this.criteria.tags = [];
    }

    if (event.added) {
      this.criteria.tags.push(event.tag);
    } else {
      this.criteria.tags = this.criteria.tags.filter(c => c !== event.tag);
    }

    this.searchCriteriaChange();
  }
  sortOrderChanged(sortOrder: string) {
    this.criteria.sortOrder = sortOrder;
    this.searchCriteriaChange();
  }
  searchCriteriaChange() {
    this.store.dispatch(new adminActions.LoadQuestions({ 'startRow': 0, 'pageSize': 25, criteria: this.criteria }));
  }

  tapped(value) {
    this.store.dispatch(new adminActions.SaveArchiveToggleState({ toggle_state: value }));
    this.toggleValue = value;
    (this.toggleValue) ? this.router.navigate(['admin/questions/bulk-questions']) : this.router.navigate(['/admin/questions']);
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.store.dispatch(new adminActions.SaveQuestionToggleState
      ({ toggle_state: tabChangeEvent.index === 0 ? 'Published' : 'Unpublished' }));
  }
}
