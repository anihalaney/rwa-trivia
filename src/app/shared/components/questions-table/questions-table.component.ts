import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import {DataSource} from '@angular/cdk';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Question, QuestionStatus, Category }     from '../../../model';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() questions: Question[];
  @Input() categoryDictionary: {[key: number]: Category};
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();

  questionsSubject: BehaviorSubject<Question[]>;
  questionsDS: QuestionsDataSource;

  constructor() {
    this.questionsSubject = new BehaviorSubject<Question[]>([]);
    this.questionsDS = new QuestionsDataSource(this.questionsSubject);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.questionsSubject.next(this.questions);
  }

  ngOnDestroy() {
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }
  approveButtonClicked(question: Question ) {
    this.approveClicked.emit(question)
  }
}

export class QuestionsDataSource extends DataSource<Question> {
  constructor(private questionsObs: BehaviorSubject<Question[]>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Question[]> {
    return this.questionsObs;
  }

  disconnect() {}
}
