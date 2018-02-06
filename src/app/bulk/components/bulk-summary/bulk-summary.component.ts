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
import { filePublishedQuestions, fileUnpublishedQuestions, bulkUploadFileInfos } from 'app/core/store/reducers';
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

  fileQuestionsStatus = false;
  parsedQuestions: Array<Question>;
  unPublishedquestion: Question[];
  publishedquestion: Question[];

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  UnPublishedQuestionObs: Observable<Question[]>;
  PublishedQuestionObs: Observable<Question[]>;
  publishedSub: any;
  unPublishedSub: any;
  bulkUploadSub: any;
  catSub: Subscription;

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.UnPublishedQuestionObs = store.select(s => s.fileUnpublishedQuestions);
    this.PublishedQuestionObs = store.select(s => s.filePublishedQuestions);

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
    this.store.dispatch(this.questionActions.loadFileUnpublishedQuestions(bulkUploadFileInfoObject));
    this.unPublishedSub = this.UnPublishedQuestionObs.subscribe(question => this.unPublishedquestion = question);

    // for published questions
    this.store.dispatch(this.questionActions.loadFilePublishedQuestions(bulkUploadFileInfoObject));
    this.publishedSub = this.PublishedQuestionObs.subscribe(question => this.publishedquestion = question);

    setTimeout(() => {
      this.fileQuestionsStatus = true;
      this.totalCount = this.publishedquestion.length;
    }, 500);

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
