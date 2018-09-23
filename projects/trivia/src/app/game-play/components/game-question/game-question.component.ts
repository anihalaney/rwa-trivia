import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Question, Answer, User } from '../../../../../../shared-library/src/lib/shared/model';

@Component({
  selector: 'game-question',
  templateUrl: './game-question.component.html',
  styleUrls: ['./game-question.component.scss']
})
export class GameQuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() questionIndex: number;
  @Input() question: Question;
  @Input() categoryName: string;
  @Input() timer: number;
  @Input() continueNext: boolean;
  @Input() correctCount: number;
  @Input() questionRound: number;
  @Input() noOfQuestions: number;
  @Input() showContinueBtn: boolean;
  @Input() otherPlayer: User;
  @Input() totalRound: number;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() okClick = new EventEmitter();
  @Output() continueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter();
  @Input() turnFlag: boolean;
  @Input() threeConsecutiveAnswer: boolean;

  answeredIndex: number;
  correctAnswerIndex: number;
  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('loader') loader: ElementRef;
  @Input() userDict: { [key: string]: User };
  doPlay = true;



  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    const seconds = 30;
    const loader = this.loader.nativeElement, α = 0;

    this.draw(α, this.doPlay, loader);
  }

  draw(α, doPlay, loader) {
    α++;
    α %= 360;
    let r = (α * Math.PI / 180)
      , x = Math.sin(r) * 125
      , y = Math.cos(r) * -125
      , mid = (α > 180) ? 1 : 1
      , anim = 'M 1 1 v -125 A 125 125 1 '
        + mid + ' 1 '
        + x + ' '
        + y + ' z';


    if (this.doPlay) {
      loader.setAttribute('d', anim);
      setTimeout(() => {
        this.draw(α, this.doPlay, loader)
      }, 44); // Redraw
    }
  }

  answerButtonClicked(answer: Answer, index: number) {
    if (this.answeredIndex >= 0 || this.continueNext) {
      return;
    }
    this.doPlay = false;
    this.answeredIndex = index;
    this.answerClicked.emit(index)
  }

  disableQuestions(correctAnswerIndex: number) {
    this.doPlay = false;
    this.correctAnswerIndex = correctAnswerIndex;
  }

  fillTimer() {
    this.loader.nativeElement.setAttribute('d', 'M 1 1 v -125 A 125 125 1 1 1 0 -125 z');
  }
}
