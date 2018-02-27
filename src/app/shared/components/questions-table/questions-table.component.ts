import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { PageEvent, MatSelectChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { Utils } from '../../../core/services';
import { AppState, appState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Question, QuestionStatus, Category, User, Answer, BulkUploadFileInfo } from '../../../model';
import { QuestionActions, BulkUploadActions } from '../../../core/store/actions';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnChanges {

  @Input() showSort: boolean;
  @Input() showPaginator: boolean;
  @Input() questions: Question[];
  @Input() totalCount: number;
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
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
  editQuestionStatus = false;
  reason: String = '';

  requestQuestion: Question;
  rejectQuestion: Question;
  editQuestion: Question;
  user: User;

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions,
    private bulkUploadActions: BulkUploadActions,
    private fb: FormBuilder) {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
    this.sortOrder = 'Category';
}

  ngOnInit() {

    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user);
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

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  // approveQuestions
  approveQuestion(question: Question) {
    question.approved_uid = this.user.userId;
    this.store.dispatch(this.questionActions.approveQuestion(question));
    if (this.bulkUploadFileInfo) {
      if (question.status === QuestionStatus.REJECTED) {
        this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
      }
      this.bulkUploadFileInfo.approved = this.bulkUploadFileInfo.approved + 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }
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

    if (this.bulkUploadFileInfo && this.requestQuestion.status === QuestionStatus.REJECTED) {
      this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }

    this.requestQuestion.status = QuestionStatus.REQUEST_TO_CHANGE;
    this.requestQuestion.reason = this.requestFormGroup.get('reason').value;
    this.requestQuestionStatus = false;
    this.requestQuestion.approved_uid = this.user.userId;
    this.store.dispatch(this.questionActions.updateQuestion(this.requestQuestion));
    this.requestFormGroup.get('reason').setValue('');
  }

  saveRejectToChangeQuestion() {
    if (!this.rejectFormGroup.valid) {
      return;
    }

    if (this.bulkUploadFileInfo && this.rejectQuestion.status !== QuestionStatus.REJECTED) {
      this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected + 1;
      this.store.dispatch(this.bulkUploadActions.updateBulkUpload(this.bulkUploadFileInfo));
    }

    this.rejectQuestion.status = QuestionStatus.REJECTED;
    this.rejectQuestion.reason = this.rejectFormGroup.get('reason').value;
    this.rejectQuestionStatus = false;
    this.rejectQuestion.approved_uid = this.user.userId;

    this.store.dispatch(this.questionActions.updateQuestion(this.rejectQuestion));
    this.rejectFormGroup.get('reason').setValue('');
  }

  editQuestions(row: Question) {
    this.editQuestion = row;
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

  nullifyQuestion(updateStatus: boolean) {
    if (updateStatus) {
      this.editQuestion = null;
    }
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