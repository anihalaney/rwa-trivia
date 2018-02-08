import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import { bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions, userBulkUploadFileInfos } from 'app/core/store/reducers';
import { concat } from 'rxjs/operator/concat';
import { Subscription } from 'rxjs/Subscription';
import { PageEvent } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'bulk-summary-child',
  templateUrl: './bulk-summary-child.component.html',
  styleUrls: ['./bulk-summary-child.component.scss']
})
export class BulkSummaryChildComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {



  categoryDictObs: Observable<{ [key: number]: Category }>;
  userBulkUploadFileInfo: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  totalCount: number;
  categoryDict: { [key: number]: Category };
  selectedFile: BulkUploadFileInfo;

  user: User;

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

  @Input() bulkSummaryDetailPath: String;


  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // dataSource: MatTableDataSource<BulkUploadFileInfo>;

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private bulkUploadActions: BulkUploadActions,
    private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.unPublishedQuestionObs = store.select(s => s.bulkUploadUnpublishedQuestions);
    this.publishedQuestionObs = store.select(s => s.bulkUploadPublishedQuestions);

    this.bulkUploadObs = store.select(s => s.userBulkUploadFileInfos);
    this.categoryDictObs = store.select(s => s.categoryDictionary);

    this.store.take(1).subscribe(s => this.user = s.user);



  }
  ngOnInit() {

    // this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(this.userBulkUploadFileInfo);
    // this.dataSource.paginator = this.paginator;
    // console.log("sd", this.v);
    // console.log(this.userBulkUploadFileInfo);
  }

  ngOnChanges() {
    if (this.bulkSummaryDetailPath) {
      this.store.dispatch((this.bulkSummaryDetailPath.includes('admin')) ? this.bulkUploadActions.loadBulkUpload()
        : this.bulkUploadActions.loadUserBulkUpload(this.user));
      this.subs.push(this.bulkUploadObs.subscribe(userBulkUploadFileInfo => this.uploadsSubject.next(userBulkUploadFileInfo)));
      this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
      this.uploadsSubject.next(this.userBulkUploadFileInfo);
    }
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(id) {
    this.router.navigate([this.bulkSummaryDetailPath + 'bulk/details', id]);
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
