import { Component, Input, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions, QuestionActions } from '../../../core/store/actions';
import {
  bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions,
  userBulkUploadFileInfos, bulkUploadFileInfos
} from 'app/core/store/reducers';
import { concat } from 'rxjs/operator/concat';
import { Subscription } from 'rxjs/Subscription';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'bulk-summary-child',
  templateUrl: './bulk-summary-child.component.html',
  styleUrls: ['./bulk-summary-child.component.scss']
})
export class BulkSummaryChildComponent implements OnInit, OnDestroy, OnChanges {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  userBulkUploadFileInfo: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  totalCount: number;
  categoryDict: { [key: number]: Category };
  selectedFile: BulkUploadFileInfo;

  user: User;

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  subs: Subscription[] = [];

  @Input() bulkSummaryDetailPath: String;

  constructor(private store: Store<AppStore>,
    private questionActions: QuestionActions,
    private bulkUploadActions: BulkUploadActions,
    private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);

    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.store.take(1).subscribe(s => this.user = s.user);
  }
  ngOnInit() {
  }

  ngOnChanges() {
    if (this.bulkSummaryDetailPath) {

      this.bulkUploadObs = this.store.select((this.bulkSummaryDetailPath.includes('admin'))
        ? s => s.bulkUploadFileInfos : s => s.userBulkUploadFileInfos);

      this.store.dispatch((this.bulkSummaryDetailPath.includes('admin')) ? this.bulkUploadActions.loadBulkUpload()
        : this.bulkUploadActions.loadUserBulkUpload(this.user));
      this.subs.push(this.bulkUploadObs.subscribe(userBulkUploadFileInfo => this.uploadsSubject.next(userBulkUploadFileInfo)));
      this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
      this.uploadsSubject.next(this.userBulkUploadFileInfo);
    }
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(id) {
    this.router.navigate([this.bulkSummaryDetailPath + 'bulk/details', id]);
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
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
