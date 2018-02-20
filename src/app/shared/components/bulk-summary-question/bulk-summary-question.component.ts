import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category, User } from '../../../model';
import { QuestionActions } from '../../../core/store/actions';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource } from '@angular/material';
import { Utils } from '../../../core/services';
import { AngularFireStorage } from 'angularfire2/storage';


@Component({
  selector: 'app-bulk-summary-questions',
  templateUrl: './bulk-summary-question.component.html',
  styleUrls: ['./bulk-summary-question.component.scss']
})
export class BulkSummaryQuestionComponent implements OnInit, OnChanges, OnDestroy {

  unPublishedQuestions: Question[];
  publishedQuestions: Question[];
  publishedCount: number;
  unPublishedCount: number;
  unPublishedQuestionObs: Observable<Question[]>;
  publishedQuestionObs: Observable<Question[]>;

  user: User;

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };

  subs: Subscription[] = [];
  fileInfoDS: MatTableDataSource<BulkUploadFileInfo>;

  PUBLISHED_SHOW_BUTTON_STATE = false;
  UNPUBLISHED_SHOW_BUTTON_STATE = true;

  downloadUrl: Observable<string | null>;

  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() isAdminUrl: boolean;

  constructor(private store: Store<AppStore>,
    private storage: AngularFireStorage,
    private questionActions: QuestionActions) {
    this.store.take(1).subscribe(s => this.user = s.user);
  }

  ngOnInit() {
    this.categoryDictObs = this.store.select(s => s.categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    if (this.bulkUploadFileInfo) {
      this.fileInfoDS = new MatTableDataSource<BulkUploadFileInfo>([this.bulkUploadFileInfo]);
      this.unPublishedQuestionObs = this.store.select(s => s.bulkUploadUnpublishedQuestions);
      this.publishedQuestionObs = this.store.select(s => s.bulkUploadPublishedQuestions);

      // get published question by BulkUpload Id
      this.store.dispatch(this.questionActions.loadBulkUploadPublishedQuestions(this.bulkUploadFileInfo));
      this.subs.push(this.publishedQuestionObs.subscribe((questions) => {
        this.publishedCount = questions.length;
        this.publishedQuestions = questions;
      }));

      // get unpublished question by BulkUpload Id
      this.store.dispatch(this.questionActions.loadBulkUploadUnpublishedQuestions(this.bulkUploadFileInfo));
      this.subs.push(this.unPublishedQuestionObs.subscribe((questions) => {
        this.unPublishedCount = questions.length;
        this.unPublishedQuestions = questions;
      }));

      const filePath = 'bulk_upload/' + this.user.userId + '/' + this.bulkUploadFileInfo.id + '-' + this.bulkUploadFileInfo.fileName;
      const ref = this.storage.ref(filePath);
      this.downloadUrl = ref.getDownloadURL();
    }
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}


