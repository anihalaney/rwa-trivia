import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Question, QuestionStatus, Category, User } from '../../model';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() questions: Question[];
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();
  @Input() userDict: { [key: string]: User };

  viewReasonArray = [];

  constructor() {
  }

  ngOnInit() {
  }
  ngOnChanges() {
  }

  ngOnDestroy() {
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }
  approveButtonClicked(question: Question) {
    this.approveClicked.emit(question)
  }
  showReason(row, index) {
    if (this.viewReasonArray[index] === undefined) {
      this.viewReasonArray[index] = row;
    }
  }
}
