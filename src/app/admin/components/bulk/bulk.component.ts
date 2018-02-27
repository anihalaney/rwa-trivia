import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import { bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, bulkUploadFileInfos } from 'app/core/store/reducers';
import { concat } from 'rxjs/operator/concat';
import { Subscription } from 'rxjs/Subscription';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-bulk',
  templateUrl: './bulk.component.html',
  styleUrls: ['./bulk.component.scss']
})
export class BulkComponent implements OnInit, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  bulkUploadFileInfo: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  totalCount: number;
  categoryDict: { [key: number]: Category };
  fileQuestionsStatus = false;
  unPublishedQuestions: Question[];
  publishedQuestions: Question[];

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;
  publishedSub: any;
  unPublishedSub: any;
  bulkUploadSub: any;
  catSub: Subscription;

  private bulkSummaryDetailPath = 'admin/';

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.unPublishedQuestionObs = store.select(s => s.bulkUploadUnpublishedQuestions);
    this.publishedQuestionObs = store.select(s => s.bulkUploadPublishedQuestions);

    this.bulkUploadObs = store.select(s => s.bulkUploadFileInfos);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }
  ngOnInit() {
    this.bulkUploadSub = this.bulkUploadObs.subscribe(bulkUploadFileInfo => this.bulkUploadFileInfo = bulkUploadFileInfo);
    this.catSub = this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict)
    this.uploadsSubject.next(this.bulkUploadFileInfo);
  }

  // get Questions by File Id
  getFileQuestions(id) {
    const bulkUploadFileInfoObject = new BulkUploadFileInfo();
    bulkUploadFileInfoObject.id = id;
    // for unpublished questions
    this.store.dispatch(this.questionActions.loadBulkUploadUnpublishedQuestions(bulkUploadFileInfoObject));
    this.unPublishedSub = this.unPublishedQuestionObs.subscribe(question => this.unPublishedQuestions = question);

    // for published questions
    this.store.dispatch(this.questionActions.loadBulkUploadPublishedQuestions(bulkUploadFileInfoObject));
    this.publishedSub = this.publishedQuestionObs.subscribe(question => this.publishedQuestions = question);
    setTimeout(() => {
      this.fileQuestionsStatus = true;
      this.totalCount = this.publishedQuestions.length;
    }, 500);

  }

  // approveQuestions
  approveQuestion(question: Question) {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;
    this.store.dispatch(this.questionActions.approveQuestion(question));
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.bulkUploadSub, this.publishedSub, this.unPublishedSub]);
  }

  backToSummary() {
    this.fileQuestionsStatus = false;
  }
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
