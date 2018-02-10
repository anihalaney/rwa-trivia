import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Category, User } from '../../../model';
import { Utils } from '../../../core/services';
import { BulkUploadActions } from '../../../core/store/actions';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatTableDataSource } from '@angular/material';



@Component({
  selector: 'bulk-summary-table',
  templateUrl: './bulk-summary-table.component.html',
  styleUrls: ['./bulk-summary-table.component.scss']
})
export class BulkSummaryTableComponent implements OnInit, OnDestroy {

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

  @Input() bulkSummaryDetailPath: String;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<AppStore>,
    private bulkUploadActions: BulkUploadActions
    ) {
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.store.take(1).subscribe(s => this.user = s.user);
  }
  ngOnInit() {
    if (this.bulkSummaryDetailPath) {
      this.bulkUploadObs = this.store.select((this.bulkSummaryDetailPath.includes('admin'))
        ? s => s.bulkUploadFileInfos : s => s.userBulkUploadFileInfos);

      this.isAdminUrl = this.bulkSummaryDetailPath.includes('admin') ? true : false;
      this.store.dispatch((this.isAdminUrl) ? this.bulkUploadActions.loadBulkUpload()
        : this.bulkUploadActions.loadUserBulkUpload(this.user));
      this.subs.push(this.bulkUploadObs.subscribe((userBulkUploadFileInfo) => {
        this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(userBulkUploadFileInfo);
        this.dataSource.paginator = this.paginator;
      }));
      this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
     }
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
    // this._location.back();
    this.SHOW_SUMMARY_TABLE = true;
  }
}
