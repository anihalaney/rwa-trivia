import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { Question, Answer }     from '../../../model';

@Component({
  selector: 'game-question-continue',
  templateUrl: './game-question-continue.component.html',
  styleUrls: ['./game-question-continue.component.scss']
})
export class GameQuestionContinueComponent implements OnInit, OnDestroy {
  @Input() question: Question;
  @Input() categoryName: string;
  @Output() continueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
