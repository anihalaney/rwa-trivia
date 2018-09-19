import { Component, Input, Output, OnInit, EventEmitter, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { BulkUploadFileInfo, Question, Category } from '../../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { MatTableDataSource } from '@angular/material';

import { AngularFireStorage } from 'angularfire2/storage';


import { MatSnackBar } from '@angular/material';

import { bulkState } from '../../../store';
import * as bulkActions from '../../../store/actions';
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})
export class BulkSummaryQuestionComponent implements OnInit, OnDestroy {

  unPublishedQuestions: Question[];
  publishedQuestions: Question[];
  publishedCount: number;
  unPublishedCount: number;
  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  fileInfoDS: MatTableDataSource<BulkUploadFileInfo>;

  PUBLISHED_SHOW_BUTTON_STATE = false;
  UNPUBLISHED_SHOW_BUTTON_STATE = true;
  downloadUrl: Observable<string | null>;

  bulkUploadFileInfo: BulkUploadFileInfo;
  isAdminUrl: boolean;

  subs: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage, private activatedRoute: ActivatedRoute, private router: Router) {

    this.subs.push(this.store.select(bulkState).pipe(select(s => s.questionSaveStatus)).subscribe(status => {
      if (status === 'UPDATE') {
        this.snackBar.open('Question Updated!', '', { duration: 1500 });
      }
    }));

    this.subs.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileUrl)).subscribe((url) => {
      if (url) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        this.store.dispatch(new bulkActions.LoadBulkUploadFileUrlSuccess(undefined));
      }
    }));

    this.subs.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileInfo)).subscribe((obj) => {
      if (obj) {
        this.bulkUploadFileInfo = obj;
        this.fileInfoDS = new MatTableDataSource<BulkUploadFileInfo>([obj]);

        // get published question by BulkUpload Id
        this.publishedQuestionObs = this.store.select(bulkState).pipe(select(s => s.bulkUploadPublishedQuestions));
        this.store.dispatch(new bulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
        this.publishedQuestionObs.subscribe((questions) => {
          if (questions) {
            this.publishedCount = questions.length;
            this.publishedQuestions = questions;
          }
        });

        // get unpublished question by BulkUpload Id
        this.unPublishedQuestionObs = this.store.select(bulkState).pipe(select(s => s.bulkUploadUnpublishedQuestions));
        this.store.dispatch(new bulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
        this.unPublishedQuestionObs.subscribe((questions) => {
          if (questions) {
            this.unPublishedCount = questions.length;
            this.unPublishedQuestions = questions;
          }
        });

        // get the download file url
        // tslint:disable-next-line:max-line-length
        const filePath = `bulk_upload/${this.bulkUploadFileInfo.created_uid}/${this.bulkUploadFileInfo.id}-${this.bulkUploadFileInfo.fileName}`;
        const ref = this.storage.ref(filePath);
        this.downloadUrl = ref.getDownloadURL();
        ref.getDownloadURL().subscribe(res => {
          this.downloadUrl = res;
        });
      }
    }));

  }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url.toString();
    if (url.includes('admin')) {
      this.isAdminUrl = true;
    } else {
      this.isAdminUrl = false;
    }
    this.categoryDictObs = this.store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const bulkId = params['bulkid'];
      this.store.dispatch(new bulkActions.LoadBulkUploadFile({ bulkId: bulkId }));

    });
  }

  downloadFile() {
    this.store.dispatch(new bulkActions.LoadBulkUploadFileUrl({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
  }

  navigation() {
    (!this.isAdminUrl) ? this.router.navigate(['/bulk']) : this.router.navigate(['/admin/bulk']);
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}


