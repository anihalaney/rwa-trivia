import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import { User, Category, Question, BulkUploadFileInfo } from '../../../model';

import * as bulkactions from '../../store/actions';

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss']
})
export class BulkSummaryComponent implements OnInit {
  private bulkSummaryDetailPath = '/';

  bulkUploadFileInfosObs: Observable<BulkUploadFileInfo[]>;

  constructor(
    private store: Store<AppState>
  ) {
    this.store.dispatch(new bulkactions.LoadBulkUpload());
  }

  ngOnInit() {

    this.bulkUploadFileInfosObs = this.store.select(appState.bulkState).select(s => s.bulkUploadFileInfos);
    this.bulkUploadFileInfosObs.subscribe(bulkUploadFileInfos => {
      console.log(bulkUploadFileInfos);
    });
  }

}
