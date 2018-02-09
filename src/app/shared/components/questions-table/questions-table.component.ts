import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { PageEvent, MatCheckboxChange, MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Question, QuestionStatus, Category, SearchResults, SearchCriteria, User } from '../../../model';
import { QuestionActions } from '../../../core/store/actions';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class QuestionsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() showSort: boolean;
  @Input() showPaginator: boolean;
  @Input() questions: Question[];
  @Input() totalCount: number;
  @Input() categoryDictionary: { [key: number]: Category };

  @Input() showApproveButton: boolean;
  @Input() showButtons: boolean;
  @Output() onApproveClicked = new EventEmitter<Question>();
  @Output() onPageChanged = new EventEmitter<PageEvent>();
  @Output() onSortOrderChanged = new EventEmitter<string>();



  requestFormGroup: FormGroup;
  rejectFormGroup: FormGroup;

  sortOrder: string;
  questionsSubject: BehaviorSubject<Question[]>;
  questionsDS: QuestionsDataSource;

  requestQuestionStatus = false;
  rejectQuestionStatus = false;
  emptyReason = false;


  reason: String = '';

  requestQuestion: Question;
  rejectQuestion: Question;

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private fb: FormBuilder) {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
    this.sortOrder = "Category";
  }

  ngOnInit() {
    this.requestFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });
    this.rejectFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });
  }

  ngOnChanges() {
    this.questionsSubject.next(this.questions);
  }

  ngOnDestroy() {
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  // approveQuestions
  approveQuestion(question: Question) {
    console.log(question);
    let user: User;
    this.store.take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;
    this.store.dispatch(this.questionActions.approveQuestion(question));
  }


  displayRequestToChange(question: Question) {
    this.requestQuestionStatus = true;
    this.rejectQuestionStatus = false;
    this.requestQuestion = question;
  }

  displayRejectToChange(question: Question) {
    this.rejectQuestionStatus = true;
    this.requestQuestionStatus = false;
    this.rejectQuestion = question;
  }

  saveRequestToChangeQuestion() {
    if (!this.requestFormGroup.valid) {
      return;
    }
    this.requestQuestion.status = QuestionStatus.REQUEST_TO_CHANGE;
    this.requestQuestion.reason = this.requestFormGroup.get('reason').value;
    this.store.dispatch(this.questionActions.addQuestion(this.requestQuestion));
  }
  saveRejectToChangeQuestion() {
    if (!this.rejectFormGroup.valid) {
      return;
    }
    this.rejectQuestion.status = QuestionStatus.REJECTED;
    this.rejectQuestion.reason = this.rejectFormGroup.get('reason').value;
    this.store.dispatch(this.questionActions.addQuestion(this.rejectQuestion));
  }

  approveButtonClicked(question: Question) {
    this.onApproveClicked.emit(question)
  }
  pageChanged(pageEvent: PageEvent) {
    this.onPageChanged.emit(pageEvent);
  }
  sortOrderChanged(event: MatSelectChange) {
    this.onSortOrderChanged.emit(event.value);
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

  disconnect() { }
}
