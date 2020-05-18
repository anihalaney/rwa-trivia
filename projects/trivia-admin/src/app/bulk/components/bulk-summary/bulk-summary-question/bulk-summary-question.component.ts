import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Utils } from 'shared-library/core/services';
import { BulkUploadFileInfo, Category, Question, QuestionStatus, User } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../../store';
import { bulkState } from '../../../store';
import * as bulkActions from '../../../store/actions';

@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
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
  user: User;
  subscriptions: Subscription[] = [];


  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage, private activatedRoute: ActivatedRoute, private router: Router,
    private utils: Utils) {

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.questionSaveStatus)).subscribe(status => {
      if (status === 'UPDATE') {
        this.snackBar.open('Question Updated!', '', { duration: 1500 });
      }
    }));

    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileUrl)).subscribe((url) => {
      if (url) {
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        this.store.dispatch(new bulkActions.LoadBulkUploadFileUrlSuccess(undefined));
      }
    }));

    this.publishedQuestionObs = this.store.select(bulkState).pipe(select(s => s.bulkUploadPublishedQuestions));
    this.subscriptions.push(this.publishedQuestionObs.subscribe((questions) => {
      if (questions) {
        this.publishedCount = questions.length;
        this.publishedQuestions = questions;
      }
    }));

    this.unPublishedQuestionObs = this.store.select(bulkState).pipe(select(s => s.bulkUploadUnpublishedQuestions));
    this.subscriptions.push(this.unPublishedQuestionObs.subscribe((questions) => {
      if (questions) {
        this.unPublishedCount = questions.length;
        this.unPublishedQuestions = questions;
      }
    }));


    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileInfo)).subscribe((obj) => {
      if (obj) {
        this.bulkUploadFileInfo = obj;
        this.fileInfoDS = new MatTableDataSource<BulkUploadFileInfo>([obj]);

        // get published question by BulkUpload Id
        this.store.dispatch(new bulkActions.LoadBulkUploadPublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));

        // get unpublished question by BulkUpload Id
        this.store.dispatch(new bulkActions.LoadBulkUploadUnpublishedQuestions({ bulkUploadFileInfo: this.bulkUploadFileInfo }));

        // get the download file url
        // tslint:disable-next-line:max-line-length
        const filePath = `bulk_upload/${this.bulkUploadFileInfo.created_uid}/${this.bulkUploadFileInfo.id}-${this.bulkUploadFileInfo.fileName}`;
        const ref = this.storage.ref(filePath);
        this.downloadUrl = ref.getDownloadURL();
        this.subscriptions.push(ref.getDownloadURL().subscribe(res => {
          this.downloadUrl = res;
        }));
      }
    }));

    this.categoriesObs = store.select(getCategories);
    this.tagsObs = this.store.select(getTags);

  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
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

  approveUnpublishedQuestions(question: Question) {
    this.store.dispatch(new bulkActions.ApproveQuestion({ question: question }));
  }

  updateBulkUpload(bulkUploadFileInfo: BulkUploadFileInfo) {
    this.store.dispatch(new bulkActions.UpdateBulkUpload({ bulkUploadFileInfo: bulkUploadFileInfo }));
  }

  loadBulkUploadById(question: Question) {
    this.store.dispatch(new bulkActions.LoadBulkUploadFile({ bulkId: question.bulkUploadId }));
  }

  updateUnpublishedQuestions(question: Question) {
    this.store.dispatch(new bulkActions.UpdateQuestion({ question: question }));
  }

  updateBulkUploadedApprovedQuestionStatus(question: Question) {
    this.loadBulkUploadById(question);
    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileInfo)).subscribe((obj) => {
      if (obj) {
        this.bulkUploadFileInfo = obj;
        if (question.status === QuestionStatus.REJECTED) {
          this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
        }
        this.bulkUploadFileInfo.approved = this.bulkUploadFileInfo.approved + 1;
        this.updateBulkUpload(this.bulkUploadFileInfo);
        this.bulkUploadFileInfo = undefined;
      }
    }));
  }

  updateBulkUploadedRequestToChangeQuestionStatus(question: Question) {
    this.loadBulkUploadById(question);
    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileInfo)).subscribe((obj) => {
      if (obj) {
        this.bulkUploadFileInfo = obj;
        if (this.bulkUploadFileInfo.rejected > 0) {
          this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected - 1;
        }
        this.updateBulkUpload(this.bulkUploadFileInfo);
        this.bulkUploadFileInfo = undefined;
      }
    }));
  }

  updateBulkUploadedRejectQuestionStatus(question: Question) {
    this.loadBulkUploadById(question);
    this.subscriptions.push(this.store.select(bulkState).pipe(select(s => s.bulkUploadFileInfo)).subscribe((obj) => {
      if (obj) {
        this.bulkUploadFileInfo = obj;
        this.bulkUploadFileInfo.rejected = this.bulkUploadFileInfo.rejected + 1;
        this.updateBulkUpload(this.bulkUploadFileInfo);
        this.bulkUploadFileInfo = undefined;
      }
    }));
  }


  ngOnDestroy() {

  }
}


