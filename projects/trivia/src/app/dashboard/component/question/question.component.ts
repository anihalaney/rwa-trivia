import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Question, Answer, User } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from './../../../../../../shared-library/src/lib/core/store/actions';
import { Utils } from './../../../../../../shared-library/src/lib/core/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class QuestionComponent implements OnDestroy {

  question: Question;
  categoryName: string;
  @Input() userDict: { [key: string]: User };

  @Output() answerClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter();

  answeredText: string;
  correctAnswerText: string;
  doPlay = true;
  categoryDictionary: any;
  subscriptions = [];

  constructor(private store: Store<AppState>, private questionAction: QuestionActions, private utils: Utils,
    private cd: ChangeDetectorRef) {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.subscriptions.push(this.store.select(categoryDictionary).subscribe(categories => {
      this.categoryDictionary = categories;
      this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay)).subscribe(questionOfTheDay => {
        if (questionOfTheDay) {
          this.question = questionOfTheDay;
          this.cd.markForCheck();
          this.question.answers = utils.changeAnswerOrder(questionOfTheDay.answers);
          if (this.question.answers) {
            this.question.answers.forEach((item, index) => {
              if (item.correct === true) {
                this.correctAnswerText = item.answerText;
              }
            });
          }

          if (this.question.categoryIds) {
            this.categoryName = this.question.categoryIds.map(category => {
              if (this.categoryDictionary[category]) {
                return this.categoryDictionary[category].categoryName;
              } else {
                return '';
              }
            }).join(',');
          }
          this.cd.markForCheck();
        }
      }));
      this.cd.markForCheck();
    }));


  }

  answerButtonClicked(answer: Answer) {
    if (this.doPlay) {
      this.answeredText = answer.answerText;
      this.doPlay = false;
      const index = this.question.answers.findIndex(x => x.answerText === answer.answerText);
      this.answerClicked.emit(index);
    }
  }

  getNextQuestion() {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.doPlay = true;
    this.store.dispatch(this.questionAction.getQuestionOfTheDay());

  }

  rippleTap(answer) {
    this.answerButtonClicked(answer);
  }
  ngOnDestroy(): void {

  }

}
