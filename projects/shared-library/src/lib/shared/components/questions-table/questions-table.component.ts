import {
  Component, Input, Output, OnInit, OnChanges, EventEmitter,
  ViewChild, AfterViewInit, SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { PageEvent, MatSelectChange } from '@angular/material';
import { Question, QuestionStatus, Category, User, Answer, BulkUploadFileInfo } from '../../model';
import { Utils } from '../../../core/services';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() showSort: boolean;
  @Input() showPaginator: boolean;
  @Input() questions: Question[];
  @Input() totalCount: number;
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() showApproveButton: boolean;
  @Input() showButtons: boolean;
  @Input() clientSidePagination: boolean;
  @Input() userDict: { [key: string]: User };
  @Input() user: User;
  @Input() tagsObs: Observable<string[]>;
  @Input() categoriesObs: Observable<Category[]>;
  @Output() onApproveClicked = new EventEmitter<Question>();
  @Output() onPageChanged = new EventEmitter<PageEvent>();
  @Output() onSortOrderChanged = new EventEmitter<string>();
  @Output() approveUnpublishedQuestion = new EventEmitter<Question>();
  @Output() updateUnpublishedQuestions = new EventEmitter<Question>();
  @Output() updateBulkUpload = new EventEmitter<BulkUploadFileInfo>();
  @Output() loadBulkUploadById = new EventEmitter<Question>();
  @Output() updateBulkUploadedApprovedQuestionStatus = new EventEmitter<Question>();
  @Output() updateBulkUploadedRequestToChangeQuestionStatus = new EventEmitter<Question>();
  @Output() updateBulkUploadedRejectQuestionStatus = new EventEmitter<Question>();


  @ViewChild(MatPaginator) paginator: MatPaginator;


  requestFormGroup: FormGroup;
  rejectFormGroup: FormGroup;

  sortOrder: string;
  questionsSubject: BehaviorSubject<Question[]>;
  questionsDS: any;

  requestQuestionStatus = false;
  rejectQuestionStatus = false;
  editQuestionStatus = false;
  reason: String = '';

  requestQuestion: Question;
  rejectQuestion: Question;
  editQuestion: Question;


  viewReasonArray = [];
  sub: Subscription;

  constructor(
    private fb: FormBuilder) {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
    this.sortOrder = 'Category';
  }

  ngOnInit() {
    this.requestFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });
    this.rejectFormGroup = this.fb.group({
      reason: ['', Validators.required]
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['questions'] && changes['questions'].currentValue !== changes['questions'].previousValue) {
      (this.clientSidePagination) ? this.setClientSidePaginationDataSource(this.questions) : this.questionsSubject.next(this.questions);
      (changes['questions'].previousValue) ? this.setPagination() : '';
    }

  }

  ngAfterViewInit() {
    this.setPagination();
  }

  setPagination() {
    (this.clientSidePagination) ? this.questionsDS.paginator = this.paginator : '';
  }

  setClientSidePaginationDataSource(questions: Question[]) {
    this.questionsDS = new MatTableDataSource<Question>(questions);
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  // approveQuestions
  approveQuestion(question: Question) {
    question.approved_uid = this.user.userId;

    this.approveUnpublishedQuestion.emit(question);
    if (this.bulkUploadFileInfo) {
      if (question.status === QuestionStatus.REJECTED) {
        if (this.bulkUploadFileInfo.rejected !== 0) {
          this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
        }
      }
      this.bulkUploadFileInfo.approved = this.bulkUploadFileInfo.approved + 1;
      this.updateBulkUpload.emit(this.bulkUploadFileInfo);

    } else if (!this.bulkUploadFileInfo && question.bulkUploadId) {
      this.updateBulkUploadedApprovedQuestionStatus.emit(question);
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

    if (this.bulkUploadFileInfo && this.requestQuestion.status !== QuestionStatus.REQUIRED_CHANGE) {
      if (this.bulkUploadFileInfo.rejected > 0) {
        this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
      }
      this.updateBulkUpload.emit(this.bulkUploadFileInfo);

    } else if (!this.bulkUploadFileInfo && this.requestQuestion.bulkUploadId && this.requestQuestion.status !== QuestionStatus.REJECTED) {
      this.updateBulkUploadedRequestToChangeQuestionStatus.emit(this.requestQuestion);
    }
    this.requestQuestion.status = QuestionStatus.REQUIRED_CHANGE;
    this.requestQuestion.reason = this.requestFormGroup.get('reason').value;
    this.requestQuestionStatus = false;
    this.requestQuestion.approved_uid = this.user.userId;
    this.updateUnpublishedQuestions.emit(this.requestQuestion);
    this.requestFormGroup.get('reason').setValue('');
  }

  saveRejectToChangeQuestion() {
    if (!this.rejectFormGroup.valid) {
      return;
    }

    if (this.bulkUploadFileInfo && this.rejectQuestion.status !== QuestionStatus.REJECTED) {
      this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected + 1;
      this.updateBulkUpload.emit(this.bulkUploadFileInfo);
    } else if (!this.bulkUploadFileInfo && this.rejectQuestion.bulkUploadId && this.rejectQuestion.status !== QuestionStatus.REJECTED) {
      this.updateBulkUploadedRejectQuestionStatus.emit(this.rejectQuestion);
    }

    this.rejectQuestion.status = QuestionStatus.REJECTED;
    this.rejectQuestion.reason = this.rejectFormGroup.get('reason').value;
    this.rejectQuestionStatus = false;
    this.rejectQuestion.approved_uid = this.user.userId;
    this.updateUnpublishedQuestions.emit(this.rejectQuestion);
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

  showQuestion(cancelStatus: string) {

    this.viewReasonArray.forEach((val, key) => {
      if (val && val.reason === cancelStatus) {
        this.viewReasonArray[key] = undefined;
      }
    });

  }

  showReason(row, index) {
    if (this.viewReasonArray[index] === undefined) {
      this.viewReasonArray[index] = row;
    }
  }

  updateQuestionData(question: Question) {
    this.updateUnpublishedQuestions.emit(question);
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
