import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';

import { Question, QuestionStatus, Category } from '../../../model';

@Component({
  selector: 'question-list',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() questions: Question[];
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() showApproveButton: boolean;
  @Output() approveClicked = new EventEmitter<Question>();

  constructor() {
  }

  ngOnInit() {
  }
  ngOnChanges() {
   // console.log(this.questions);
  }

  ngOnDestroy() {
  }

  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }
  approveButtonClicked(question: Question) {
    this.approveClicked.emit(question)
  }
}
