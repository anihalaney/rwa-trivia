import { Component, Input, ViewChild, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { bulkState } from '../../../store';
import { BulkUploadFileInfo, Category, User } from '../../../../model';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { AngularFireStorage } from 'angularfire2/storage';
import * as bulkActions from '../../../store/actions';

@Component({
  selector: 'bulk-summary-table',
  templateUrl: './bulk-summary-table.component.html',
  styleUrls: ['./bulk-summary-table.component.scss']
})
export class BulkSummaryTableComponent implements OnInit {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  user: User;
  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  dataSource: any;

  bulkUploadFileInfo: BulkUploadFileInfo;
  isAdminUrl = false;

  displayedColumns = ['uploadDate', 'fileName', 'category',
    'primaryTag', 'countQuestionsUploaded', 'countQuestionsApproved', 'countQuestionsRejected', 'status'];

  @Input() bulkSummaryDetailPath: String;
  @Input() showSummaryTable: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() showBulkUploadBtn = new EventEmitter<String>();

  constructor(
    private store: Store<AppState>,
    private storage: AngularFireStorage) {
    this.categoryDictObs = store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);
    this.store.select(appState.coreState).take(1).subscribe((s) => {
      this.user = s.user
    });

  }

  ngOnInit() {
    if (this.bulkSummaryDetailPath && this.showSummaryTable) {
      this.loadBulkSummaryData();
    }
  }

  loadBulkSummaryData() {
    this.isAdminUrl = this.bulkSummaryDetailPath.includes('admin') ? true : false;
    this.store.dispatch((this.isAdminUrl) ? new bulkActions.LoadBulkUpload() : new bulkActions.LoadUserBulkUpload({ user: this.user }));
    this.bulkUploadObs = this.store.select(bulkState).select((this.bulkSummaryDetailPath.includes('admin'))
      ? s => s.bulkUploadFileInfos : s => s.userBulkUploadFileInfos);

    this.bulkUploadObs.subscribe(bulkUploadFileInfos => {
      if (bulkUploadFileInfos && bulkUploadFileInfos.length !== 0) {
        for (const key in bulkUploadFileInfos) {
          if (bulkUploadFileInfos[key]) {
            if (this.categoryDict[bulkUploadFileInfos[key].categoryId] !== undefined) {
              bulkUploadFileInfos[key].category = this.categoryDict[bulkUploadFileInfos[key].categoryId].categoryName;
            }

            // tslint:disable-next-line:max-line-length
            // const filePath = `bulk_upload/${bulkUploadFileInfos[key].created_uid}/${bulkUploadFileInfos[key].id}-${bulkUploadFileInfos[key].fileName}`;
            // const ref = this.storage.ref(filePath);
            // bulkUploadFileInfos[key].downloadUrl = ref.getDownloadURL();
          }
        }
        this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(bulkUploadFileInfos);
        this.setPaginatorAndSort();
      }
    });

    // add conditional columns in table
    if (this.isAdminUrl) {
      if (this.displayedColumns.indexOf('created') === -1) {
        this.displayedColumns.push('created')
      }
    }
    if (this.displayedColumns.indexOf('download') === -1) {
      this.displayedColumns.push('download')
    }
  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(row: BulkUploadFileInfo) {
    this.bulkUploadFileInfo = row;
    this.showBulkUploadBtn.emit('Bulk Upload File Details');
  }

  downloadFile(bulkUploadFileInfo: BulkUploadFileInfo) {
    const filePath = `bulk_upload/${bulkUploadFileInfo.created_uid}/${bulkUploadFileInfo.id}-${bulkUploadFileInfo.fileName}`;
    const ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(url => {
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = url;
      link.click();
    })

  }


}
