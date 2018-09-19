import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Question, QuestionStatus, Category, User, Answer } from '../../model';

@Component({
  selector: 'app-rejected-question-content',
  templateUrl: './rejected-question-content.component.html',
  styleUrls: ['./rejected-question-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectedQuestionContentComponent implements OnInit {

  @Input() rejectQuestion: Question;
  @Output() cancelStatus = new EventEmitter<any>();
  reasonMessage: String = '';

  constructor() { }

  ngOnInit() {
    this.reasonMessage = this.rejectQuestion.reason;
  }

  showQuestion() {
    this.cancelStatus.emit(this.reasonMessage);
  }

}
