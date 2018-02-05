import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {DataSource} from '@angular/cdk/table';
import { Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Category } from '../../../model';
import { BulkUploadActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit, OnDestroy {

  uploadFileInfos: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  bulkUploadFile: Observable<BulkUploadFileInfo[]>;
  sub: Subscription;
  catSub: Subscription;

  constructor(private store: Store<AppStore>,
              private router: Router,
              private bulkUploadActions: BulkUploadActions) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.bulkUploadFile = store.select(s => s.bulkUploadFileInfos);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
    this.store.dispatch(this.bulkUploadActions.loadBulkUpload());
    this.sub = this.bulkUploadFile.subscribe(uploadFileInfos => this.uploadsSubject.next(uploadFileInfos));
    this.catSub = this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);
    }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub, this.catSub]);
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

  disconnect() {}
}
