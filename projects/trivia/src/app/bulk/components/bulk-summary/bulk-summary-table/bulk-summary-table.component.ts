import {
  Component, Input, ViewChild, OnChanges, Output, EventEmitter,
  OnInit, SimpleChanges, ChangeDetectionStrategy, OnDestroy, Inject, PLATFORM_ID
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { bulkState } from '../../../store';
import { BulkUploadFileInfo, Category, User } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import * as bulkActions from '../../../store/actions';
import { Router } from '@angular/router';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'bulk-summary-table',
  templateUrl: './bulk-summary-table.component.html',
  styleUrls: ['./bulk-summary-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BulkSummaryTableComponent implements OnInit, OnChanges, OnDestroy {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  user: User;
  bulkUploadObs: Observable<BulkUploadFileInfo[]>;
  dataSource: any;
  bulkUploadFileInfo: BulkUploadFileInfo;
  isAdminUrl = false;
  subscriptions = [];

  displayedColumns = ['archive', 'uploadDate', 'fileName', 'category',
    'primaryTag', 'countQuestionsUploaded', 'countQuestionsApproved', 'countQuestionsRejected', 'status'];

  @Input() bulkSummaryDetailPath: String;
  @Input() showSummaryTable: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() showBulkUploadBtn = new EventEmitter<String>();
  @Input() isArchiveBtnClicked: boolean;
  @Input() toggleValue: boolean;
  archivedArray = [];

  constructor(
    private store: Store<AppState>,
    private storage: AngularFireStorage, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private utils: Utils) {
    this.categoryDictObs = store.select(categoryDictionary);

    this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileUrl)).subscribe((url) => {
      if (isPlatformBrowser(this.platformId) && url) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        this.store.dispatch(new bulkActions.LoadBulkUploadFileUrlSuccess(undefined));
      }
    }));

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadArchiveStatus)).subscribe((state) => {
      if (state === 'ARCHIVED') {
        this.archivedArray = [];
        this.store.dispatch(new bulkActions.SaveArchiveList(this.archivedArray));
      }
    }));

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.getArchiveList)).subscribe((list) => {
      if (list.length > 0) {
        this.archivedArray = list;
      } else {
        this.archivedArray = [];
      }
    }));

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.getArchiveList)).subscribe((list) => {
      if (list.length > 0) {
        this.archivedArray = list;
      } else {
        this.archivedArray = [];
      }
    }));


  }

  ngOnInit() {
    if (this.bulkSummaryDetailPath && this.showSummaryTable) {
      this.loadBulkSummaryData();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.isArchiveBtnClicked) {
      this.store.dispatch(new bulkActions.ArchiveBulkUpload({ archiveArray: this.archivedArray, user: this.user }));
    }

    if (changes['toggleValue'] && changes['toggleValue'].currentValue !== undefined
      && changes['toggleValue'].currentValue !== changes['toggleValue'].previousValue) {

      this.store.dispatch((this.isAdminUrl) ?
        new bulkActions.LoadBulkUpload({ user: this.user, archive: this.toggleValue }) :
        new bulkActions.LoadUserBulkUpload({ user: this.user, archive: this.toggleValue }));
    }
  }

  loadBulkSummaryData() {
    this.isAdminUrl = this.bulkSummaryDetailPath.includes('admin') ? true : false;
    this.store.dispatch((this.isAdminUrl) ?
      new bulkActions.LoadBulkUpload({ user: this.user, archive: this.isArchiveBtnClicked ? false : this.toggleValue ? true : false })
      : new bulkActions.LoadUserBulkUpload(
        { user: this.user, archive: this.isArchiveBtnClicked ? false : this.toggleValue ? true : false }));
    this.bulkUploadObs = this.store.select(bulkState).pipe(select((this.bulkSummaryDetailPath.includes('admin'))
      ? s => s.bulkUploadFileInfos : s => s.userBulkUploadFileInfos));

    this.subscriptions.push(this.bulkUploadObs.subscribe(bulkUploadFileInfos => {
      if (bulkUploadFileInfos && bulkUploadFileInfos.length !== 0) {
        for (const key in bulkUploadFileInfos) {
          if (bulkUploadFileInfos[key]) {
            if (this.categoryDict[bulkUploadFileInfos[key].categoryId] !== undefined) {
              bulkUploadFileInfos[key].category = this.categoryDict[bulkUploadFileInfos[key].categoryId].categoryName;
            }
          }
        }
      }
      this.dataSource = new MatTableDataSource<BulkUploadFileInfo>(bulkUploadFileInfos);
      this.setPaginatorAndSort();
    }));

    // add conditional columns in table
    if (this.isAdminUrl) {
      if (this.displayedColumns.indexOf('created') === -1) {
        this.displayedColumns.push('created');
      }
    }
    if (this.displayedColumns.indexOf('download') === -1) {
      this.displayedColumns.push('download');
    }
  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // get Questions by bulk upload Id
  getBulkUploadQuestions(row: BulkUploadFileInfo) {
    (!this.isAdminUrl) ? this.router.navigate(['/bulk/detail', row.id]) : this.router.navigate(['/admin/bulk/detail', row.id]);
  }

  downloadFile(bulkUploadFileInfo: BulkUploadFileInfo) {
    this.store.dispatch(new bulkActions.LoadBulkUploadFileUrl({ bulkUploadFileInfo: bulkUploadFileInfo }));

  }
  checkedRow(bulkObj) {
    const isCheck = this.archivedArray.filter(item => item.id === bulkObj.id)[0];
    if (isCheck !== undefined) {
      this.archivedArray.splice(this.archivedArray.indexOf(bulkObj.id), 1);

    } else {
      this.archivedArray.push(bulkObj);
    }
    this.store.dispatch(new bulkActions.SaveArchiveList(this.archivedArray));
  }

  checkArchieved(id: any) {
    return this.archivedArray.findIndex((row) => row.id === id) === -1 ? false : true;
  }

  ngOnDestroy() {

  }


}
