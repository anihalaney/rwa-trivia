import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {DataSource} from '@angular/cdk';
import {PageEvent, MdCheckboxChange} from '@angular/material';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Question, QuestionStatus, Category, SearchResults, SearchCriteria }     from '../../../model';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() questionsSearchResults: SearchResults;
  @Input() criteria: SearchCriteria;
  @Input() categoryDictionary: {[key: number]: Category};
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();
  @Output() pageChanged = new EventEmitter<PageEvent>();
  @Output() searchCriteriaChanged = new EventEmitter<SearchCriteria>();
  
  sortOrder: string;
  questions: Question[];
  questionsSubject: BehaviorSubject<Question[]>;
  questionsDS: QuestionsDataSource;

  categoriesObs: Observable<Category[]>;
  categoryAggregation: {[key: number]: number};
  
  questionTableForm: FormGroup;
  
  constructor(private store: Store<AppStore>,
              private fb: FormBuilder) {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
    this.categoriesObs = store.select(s => s.categories);
    this.sortOrder = "Category";
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.questions = this.questionsSearchResults.questions;
    this.categoryAggregation = this.questionsSearchResults.categoryAggregation
    this.questionsSubject.next(this.questions);
  }

  ngOnDestroy() {
  }

  createForm() {
    this.questionTableForm = this.fb.group({
      sortOrder: ['Category', Validators.required]
    });
  }
  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }
  approveButtonClicked(question: Question ) {
    this.approveClicked.emit(question)
  }
  pageChange(pageEvent: PageEvent) {
    //console.log(pageEvent);
    this.pageChanged.emit(pageEvent);
  }
  categoryChanged(event: MdCheckboxChange, category: Category) {
    console.log(event);
    //console.log(event.source.value);
    if (event.checked) {
      this.criteria.categoryIds.push(category.id);
    }
    else {
      this.criteria.categoryIds = this.criteria.categoryIds.filter(c => c != category.id);
    }
    this.searchCriteriaChanged.emit(this.criteria);
  }
}

export class QuestionsDataSource extends DataSource<Question> {
  constructor(private questionsObs: BehaviorSubject<Question[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Question[]> {
    return this.questionsObs;
  }

  disconnect() {}
}
