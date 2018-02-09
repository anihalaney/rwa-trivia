import { Component, Input, OnInit, OnDestroy, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions } from '../../../core/store/actions';
import {
  bulkUploadPublishedQuestions, bulkUploadUnpublishedQuestions,
  userBulkUploadFileInfos, bulkUploadFileInfos
} from 'app/core/store/reducers';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatTableDataSource } from '@angular/material';



@Component({
  selector: 'bulk-summary-table',
  templateUrl: './bulk-summary-table.component.html',
  styleUrls: ['./bulk-summary-table.component.scss']
})
export class BulkSummaryTableComponent implements OnInit, OnDestroy, OnChanges {

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
  dataSource: any;
  SHOW_SUMMARY_TABLE = true;
  _bulkUploadFileInfo: BulkUploadFileInfo;
  isAdminUrl = false;

  @Input() bulkSummaryDetailPath: String;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<AppStore>,
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

      this.isAdminUrl = (this.bulkSummaryDetailPath.includes('admin') ? true: false;
      this.store.dispatch((this.isAdminUrl) ? this.bulkUploadActions.loadBulkUpload()
        : this.bulkUploadActions.loadUserBulkUpload(this.user));
      this.subs.push(this.bulkUploadObs.subscribe((userBulkUploadFileInfo) => {
        this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(userBulkUploadFileInfo);
        this.dataSource.paginator = this.paginator;
      }));
      this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
      this.uploadsSubject.next(this.userBulkUploadFileInfo);
    }
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(row: BulkUploadFileInfo) {
    // this.router.navigate([this.bulkSummaryDetailPath + 'bulk/details', id]);
    this._bulkUploadFileInfo = row;
    this.SHOW_SUMMARY_TABLE = false;

  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

  backToSummary() {
    // this._location.back();
    this.SHOW_SUMMARY_TABLE = true;
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
