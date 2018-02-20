import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {DataSource} from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';

import { AppState } from '../../../store';
import { BulkUploadFileInfo } from '../../../model';

@Component({
  selector: 'bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit, OnDestroy {

  uploadFileInfos: BulkUploadFileInfo[];
  uploadsDS: FileUploadsDataSource;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;

  constructor(private store: Store<AppState>,
              private router: Router) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
  }

  ngOnInit() {
    this.uploadFileInfos = [ 
      { "file": new File([], "reactQuestions.csv"), 
        "categoryId": 1, 
        "primaryTag": "test", 
        "uploadedOn": new Date(), 
        "status": "Under Review" }
    ];
    //this.uploadFileInfos[0].file.name
    this.uploadsSubject.next(this.uploadFileInfos);
  }

  ngOnDestroy() {
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
