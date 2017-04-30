import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { Question, Answer }     from '../../../model';

@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss']
})
export class GameQuestionComponent implements OnInit, OnDestroy {
  @Input() question: Question;
  @Input() categoryName: string;
  @Input() timer: number;
  @Output() answerClicked = new EventEmitter<Answer>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  answerButtonClicked(answer: Answer ) {
    this.answerClicked.emit(answer)
  }
}
