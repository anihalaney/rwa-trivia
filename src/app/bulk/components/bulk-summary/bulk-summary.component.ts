import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import { bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, bulkUploadFileInfos } from 'app/core/store/reducers';
import { concat } from 'rxjs/operator/concat';
import { Subscription } from 'rxjs/Subscription';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  bulkUploadFileInfo: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  totalCount: number;
  categoryDict: { [key: number]: Category };
  selectedFile: BulkUploadFileInfo;

  showBulkUploadDetail = false;
  parsedQuestions: Array<Question>;
  unPublishedQuestions: Question[];
  publishedQuestions: Question[];

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;
  subs: Subscription[] = [];
  unPublishedSub: Subscription;
  publishedSub: Subscription;

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private bulkUploadActions: BulkUploadActions,
    private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.unPublishedQuestionObs = store.select(s => s.bulkUploadUnpublishedQuestions);
    this.publishedQuestionObs = store.select(s => s.bulkUploadPublishedQuestions);

    this.bulkUploadObs = store.select(s => s.bulkUploadFileInfos);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }
  ngOnInit() {
    this.store.dispatch(this.bulkUploadActions.loadBulkUpload());
    this.subs.push(this.bulkUploadObs.subscribe(bulkUploadFileInfo => this.uploadsSubject.next(bulkUploadFileInfo)));
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
    this.uploadsSubject.next(this.bulkUploadFileInfo);
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(id, row) {
    // This is temp coe will be changed

    // this.selectedFile = row;

    // const bulkUploadFileInfoObject = new BulkUploadFileInfo();
    // bulkUploadFileInfoObject.id = id;
    // // for unpublished questions
    // this.store.dispatch(this.questionActions.loadBulkUploadUnpublishedQuestions(bulkUploadFileInfoObject));
    // this.unPublishedSub = this.unPublishedQuestionObs.subscribe(questions => this.unPublishedQuestions = questions);

    // // for published questions
    // this.store.dispatch(this.questionActions.loadBulkUploadPublishedQuestions(bulkUploadFileInfoObject));
    // this.publishedSub = this.publishedQuestionObs.subscribe(questions => this.publishedQuestions = questions);
    // setTimeout(() => {
    //   this.showBulkUploadDetail = true;
    //   this.totalCount = this.publishedQuestions.length;
    // }, 500);

    this.router.navigate(['/bulk/details' , id]);

  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

  backToSummary() {
    this.showBulkUploadDetail = false;
    Utils.unsubscribe([this.publishedSub, this.unPublishedSub]);
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
