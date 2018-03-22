import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { Question, Answer } from '../../../model';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { QuestionActions } from '../../../../app/core/store/actions';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnChanges {
  @Input() question: Question;

  questionForm: FormGroup;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter();

  answeredIndex: number;
  correctAnswerIndex: number;

  constructor(private fb: FormBuilder, private store: Store<AppState>, private questionAction: QuestionActions) {
    this.answeredIndex = -1;
    this.correctAnswerIndex = -1;
  }

  ngOnChanges() {
    if (this.question.questionText !== undefined) {
      this.question.answers.forEach((item, index) => {
        if (item.correct === true) {
          this.correctAnswerIndex = index;
        }
      });

    }
  }

  answerButtonClicked(answer: Answer, index: number) {
    if (this.answeredIndex >= 0)
      return;
    this.answeredIndex = index;
    this.answerClicked.emit(index);
  }

  getNextQuestion() {
    this.answeredIndex = -1;
    this.correctAnswerIndex = -1;
    this.store.dispatch(this.questionAction.getQuestionOfTheDay());
    this.store.select(appState.coreState).select(s => s.questionOfTheDay).subscribe(questionOfTheDay => {
    });
  }

}
