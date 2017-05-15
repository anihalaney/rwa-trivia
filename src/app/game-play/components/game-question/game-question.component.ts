import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { Question, Answer }     from '../../../model';

@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss']
})
export class GameQuestionComponent implements OnInit, OnDestroy {
  @Input() questionIndex: number;
  @Input() question: Question;
  @Input() categoryName: string;
  @Input() timer: number;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() okClick = new EventEmitter();

  answeredIndex: number;
  correctAnswerIndex: number;
  @ViewChild('overlay') overlay: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  answerButtonClicked(answer: Answer, index: number ) {
    this.answeredIndex = index;
    this.answerClicked.emit(index)
  }

  disableQuestions(correctAnswerIndex: number) {
    this.correctAnswerIndex = correctAnswerIndex;
  }
}
