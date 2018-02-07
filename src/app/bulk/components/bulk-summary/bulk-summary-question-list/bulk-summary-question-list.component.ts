import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../../core/store/app-store';
import { BulkUploadFileInfo, Question, Category, User } from '../../../../model';
import { BulkUploadActions, QuestionActions } from '../../../../core/store/actions';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-summary-question-list',
  templateUrl: './bulk-summary-question-list.component.html',
  styleUrls: ['./bulk-summary-question-list.component.scss']
})
export class BulkSummaryQuestionListComponent implements OnInit, OnChanges {

  @Input() bulkUploadFileInfo: BulkUploadFileInfo;
  @Input() unPublishedQuestions: Question[];
  @Input() publishedQuestions: Question[];

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  bulkUploadFileInfoArray: BulkUploadFileInfo[] = [];
  totalCount: number;
  uploadsSubject: BehaviorSubject<BulkUploadFileInfo[]>;
  uploadsDS: FileUploadsDataSource;
  subs: Subscription[] = [];

  constructor(private store: Store<AppStore>,
     public router: Router,
     private questionActions: QuestionActions) {
    this.uploadsSubject = new BehaviorSubject<BulkUploadFileInfo[]>([]);
    this.uploadsDS = new FileUploadsDataSource(this.uploadsSubject);
    this.categoryDictObs = store.select(s => s.categoryDictionary);
  }

  ngOnInit() {
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
  }

  ngOnChanges() {
    this.totalCount = this.publishedQuestions.length;

    if (this.bulkUploadFileInfo !== undefined) {
      this.bulkUploadFileInfoArray = [];
      this.bulkUploadFileInfoArray.push(this.bulkUploadFileInfo);
    }
    this.uploadsSubject.next(this.bulkUploadFileInfoArray);
  }

  // approveQuestions
  approveQuestion(question: Question) {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user);
    question.approved_uid = user.userId;
    this.store.dispatch(this.questionActions.approveQuestion(question));
  }

  backToSummary() {
    this.router.navigate(['./bulk']);
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

  disconnect() { }
}
