import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { BulkUploadFileInfo, Question, Category } from '../../../../model';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { Utils } from '../../../../core/services';
import { AngularFireStorage } from 'angularfire2/storage';


import { MatSnackBar } from '@angular/material';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { bulkState } from '../../../store';
import * as bulkActions from '../../../store/actions';

@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})
export class BulkSummaryQuestionComponent implements OnInit, OnChanges {

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

  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() isAdminUrl: boolean;

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage) {
 
    this.store.select(bulkState).select(s => s.questionSaveStatus).subscribe(status => {
      console.log("Snackbar callded");
      if (status === 'UPDATE') {
        this.snackBar.open('Question Updated!', '', { duration: 1500 });
      }
    });

  }

  ngOnInit() {
    this.categoryDictObs = this.store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);
  }

  ngOnChanges() {
    if (this.bulkUploadFileInfo) {
      this.fileInfoDS = new MatTableDataSource<BulkUploadFileInfo>([this.bulkUploadFileInfo]);

      // get published question by BulkUpload Id
      this.publishedQuestionObs = this.store.select(bulkState).select(s => s.bulkUploadPublishedQuestions);
      this.store.dispatch(new bulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
      this.publishedQuestionObs.subscribe((questions) => {
        this.publishedCount = questions.length;
        this.publishedQuestions = questions;
      });

      // get unpublished question by BulkUpload Id
      this.unPublishedQuestionObs = this.store.select(bulkState).select(s => s.bulkUploadUnpublishedQuestions);
      this.store.dispatch(new bulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));
      this.unPublishedQuestionObs.subscribe((questions) => {
        this.unPublishedCount = questions.length;
        this.unPublishedQuestions = questions;
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
  }
}


