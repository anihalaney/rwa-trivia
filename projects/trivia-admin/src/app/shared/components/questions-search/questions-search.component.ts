import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { PageEvent, MatCheckboxChange, MatSelectChange } from '@angular/material';
import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import { Observable } from 'rxjs';

import { Question, QuestionStatus, Category, SearchResults } from '../../../model';

@Component({
  selector: 'question-search',
  templateUrl: './questions-search.component.html',
  styleUrls: ['./questions-search.component.scss']
})
export class QuestionsSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() questionsSearchResults: SearchResults;
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();
  @Output() onPageChanged = new EventEmitter<PageEvent>();
  @Output() onCategoryChanged = new EventEmitter<{ categoryId: number, added: boolean }>();
  @Output() onTagChanged = new EventEmitter<{ tag: string, added: boolean }>();
  @Output() onSortOrderChanged = new EventEmitter<string>();

  questions: Question[];
  totalCount: number;

  categoriesObs: Observable<Category[]>;
  categoryAggregation: {[key: number]: number};
  tagsCount: {tag: string, count: number}[];
  tagsChecked: {[key: string]: boolean};
  
  constructor(private store: Store<AppState>) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.questions = this.questionsSearchResults.questions;
    this.totalCount = this.questionsSearchResults.totalCount;
    this.categoryAggregation = this.questionsSearchResults.categoryAggregation;
    this.tagsCount = this.questionsSearchResults.tagsCount;
    if (this.questionsSearchResults.searchCriteria) {
      this.tagsChecked = this.questionsSearchResults.searchCriteria.tags.reduce((map, tag) => { map[tag] = true; return map }, {});
    }
  }

  ngOnDestroy() {
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }
  approveButtonClicked(question: Question) {
    this.approveClicked.emit(question)
  }
  pageChanged(pageEvent: PageEvent) {
    this.onPageChanged.emit(pageEvent);
  }
  categoryChanged(event: MatCheckboxChange, category: Category) {
    this.onCategoryChanged.emit({ 'categoryId': category.id, 'added': event.checked });
  }
  tagChanged(event: MatCheckboxChange, tag: string) {
    this.onTagChanged.emit({ 'tag': tag, 'added': event.checked });
  }
  sortOrderChanged(event: string) {
    this.onSortOrderChanged.emit(event);
  }
  onSubmit() {

  }
}
