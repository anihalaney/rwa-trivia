import { Component, Input, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions } from '../../../core/store/actions';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';


@Component({
  selector: 'bulk-summary-table',
  templateUrl: './bulk-summary-table.component.html',
  styleUrls: ['./bulk-summary-table.component.scss']
})
export class BulkSummaryTableComponent implements OnChanges, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  userBulkUploadFileInfo: BulkUploadFileInfo[];
  totalCount: number;
  categoryDict: { [key: number]: Category };
  selectedFile: BulkUploadFileInfo;

  user: User;

  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  subs: Subscription[] = [];
  dataSource: any;
  SHOW_SUMMARY_TABLE = true;
  bulkUploadFileInfo: BulkUploadFileInfo;
  isAdminUrl = false;

  displayedColumns = ['uploadDate', 'fileName', 'category',
    'primaryTag', 'countQuestionsUploaded', 'countQuestionsApproved', 'countQuestionsRejected', 'status'];

  @Input() bulkSummaryDetailPath: String;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<AppStore>,
    private storage: AngularFireStorage,
    private bulkUploadActions: BulkUploadActions) {
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.store.take(1).subscribe(s => this.user = s.user);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    if (this.bulkSummaryDetailPath) {
      this.loadBulkSummaryData();
    }
  }

  loadBulkSummaryData() {
    this.bulkUploadObs = this.store.select((this.bulkSummaryDetailPath.includes('admin'))
      ? s => s.bulkUploadFileInfos : s => s.userBulkUploadFileInfos);

    this.isAdminUrl = this.bulkSummaryDetailPath.includes('admin') ? true : false;
    this.store.dispatch((this.isAdminUrl) ? this.bulkUploadActions.loadBulkUpload()
      : this.bulkUploadActions.loadUserBulkUpload(this.user));
    this.subs.push(this.bulkUploadObs.subscribe((userBulkUploadFileInfo) => {
      for (const key in userBulkUploadFileInfo) {
        if (userBulkUploadFileInfo[key]) {
          userBulkUploadFileInfo[key].category = this.categoryDict[userBulkUploadFileInfo[key].categoryId].categoryName;
          // tslint:disable-next-line:max-line-length
          const filePath = `bulk_upload/${userBulkUploadFileInfo[key].created_uid}/${userBulkUploadFileInfo[key].id}-${userBulkUploadFileInfo[key].fileName}`;
          const ref = this.storage.ref(filePath);
          userBulkUploadFileInfo[key].downloadUrl = ref.getDownloadURL();
        }
      }
      this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(userBulkUploadFileInfo);
      this.setPaginatorAndSort();
    }));

    if (this.isAdminUrl) {
      this.displayedColumns.push('created');
      this.displayedColumns.push('download');
    } else {
      this.displayedColumns.push('download');
    }

  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(row: BulkUploadFileInfo) {
    this.bulkUploadFileInfo = row;
    this.SHOW_SUMMARY_TABLE = false;
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

  backToSummary() {
    this.SHOW_SUMMARY_TABLE = true;
    this.loadBulkSummaryData();
  }
}
