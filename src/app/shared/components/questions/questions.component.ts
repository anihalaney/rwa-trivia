import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { Question, QuestionStatus, Category }     from '../../../model';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  @Input() questions: Question[];
  @Input() categoryDictionary: {[key: number]: Category};
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();

  constructor() {
  }

  ngOnInit() {
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
