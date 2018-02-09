import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category, User } from '../../../model';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import { bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, bulkUploadFileInfosById } from 'app/core/store/reducers';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})
export class BulkSummaryQuestionComponent implements OnInit, OnChanges {

  unPublishedQuestions: Question[];
  publishedQuestions: Question[];

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  publishedCount: number;
  unPublishedCount: number;

  fileId: String;
  user: User;

  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;

  subs: Subscription[] = [];
  unPublishedSub: Subscription;
  publishedSub: Subscription;
  bulkSubs: Subscription;

  userBulkUploadFileInfo: BulkUploadFileInfo;
  uploadsDS: FileUploadsDataSource;
  bulkUploadObs: Observable<BulkUploadFileInfo>;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  uploadsSubjectArray: Array<BulkUploadFileInfo> = [];
  PUBLISHED_SHOW_BUTTON_STATE = false;
  UNPUBLISHED_SHOW_BUTTON_STATE = true;

  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() isAdminUrl: boolean;



  constructor(private store: Store<AppStore>,
    public router: Router,
    private route: ActivatedRoute,
    private questionActions: QuestionActions,
    private bulkUploadAction: BulkUploadActions,
    private _location: Location) {

    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);


  }

  ngOnInit() {
    this.categoryDictObs = this.store.select(s => s.categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    if (this.bulkUploadFileInfo) {
      this.uploadsSubjectArray.push(this.bulkUploadFileInfo);
      this.uploadsSubject.next(this.uploadsSubjectArray);

      this.unPublishedQuestionObs = this.store.select(s => s.bulkUploadUnpublishedQuestions);
      this.publishedQuestionObs = this.store.select(s => s.bulkUploadPublishedQuestions);

      // get published question by BulkUpload Id
      this.store.dispatch(this.questionActions.loadBulkUploadPublishedQuestions(this.bulkUploadFileInfo));
      this.publishedSub = this.publishedQuestionObs.subscribe((questions) => {
        this.publishedCount = questions.length;
        this.publishedQuestions = questions;
        // console.log('published', this.publishedQuestions);
      });

      // get unpublished question by BulkUpload Id
      this.store.dispatch(this.questionActions.loadBulkUploadUnpublishedQuestions(this.bulkUploadFileInfo));
      this.unPublishedSub = this.unPublishedQuestionObs.subscribe((questions) => {
        this.unPublishedCount = questions.length;
        this.unPublishedQuestions = questions;
        // console.log('unPublishedQuestions', this.unPublishedQuestions);
      });

    }
  }

  // approveQuestions
  // approveQuestion(question: Question) {
  //   let user: User;
  //   this.store.take(1).subscribe(s => user = s.user);
  //   question.approved_uid = user.userId;
  //   this.store.dispatch(this.questionActions.approveQuestion(question));
  // }



}


export class FileUploadsDataSource extends DataSource<BulkUploadFileInfo> {
  constructor(private uploadsObs: BehaviorSubject<BulkUploadFileInfo[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<BulkUploadFileInfo[]> {
    return this.uploadsObs;
  }

  disconnect() { }
}
