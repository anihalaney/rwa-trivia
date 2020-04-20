import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Question, Answer, User, ApplicationSettings } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { GameActions } from 'shared-library/core/store/actions';
import { skipWhile, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ arrayName: 'subscriptions' })
export class QuestionComponent implements OnDestroy {
  question: Question;
  categoryName: string;

  @Input() userDict: { [key: string]: User };
  @Input() user: User;
  @Input() theme: string;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter();

  answeredText: string;
  correctAnswerText: string;
  doPlay = true;
  categoryDictionary: any;
  subscriptions = [];
  applicationSettings: ApplicationSettings;

  constructor(private store: Store<AppState>, private questionAction: QuestionActions, private utils: Utils,
    private cd: ChangeDetectorRef, public gameActions: GameActions) {

    this.answeredText = '';
    this.correctAnswerText = '';
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          this.cd.markForCheck();
        }
      }));
    this.subscriptions.push(this.store.select(categoryDictionary)
      .pipe(skipWhile(categories => Object.entries(categories).length === 0 && categories.constructor === Object),
        map(categories => (this.categoryDictionary = categories)),
        switchMap(() => { return this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay)); })
      ).subscribe(questionOfTheDay => {
        if (questionOfTheDay) {
          this.doPlay = true;
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
            })
              .join(',');
          }
          this.cd.markForCheck();
        }
        this.cd.markForCheck();
      })
    );
  }

  answerButtonClicked(answer: Answer) {
    if (this.doPlay) {
      this.answeredText = answer.answerText;
      this.doPlay = false;
      const index = this.question.answers.findIndex(
        x => x.answerText === answer.answerText
      );
      if (this.answeredText === this.correctAnswerText) {
        this.store.dispatch(this.gameActions.UpdateQuestionStat(this.question.id, "CORRECT"));
      } else {
        this.store.dispatch(this.gameActions.UpdateQuestionStat(this.question.id, "WRONG"));
      }
      this.answerClicked.emit(index);
      this.cd.markForCheck();
    }
  }

  getNextQuestion() {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.store.dispatch(this.questionAction.getQuestionOfTheDay());
  }

  rippleTap(answer) {
    this.answerButtonClicked(answer);
  }

  selectedAnswer(answer: Answer) {
    this.answeredText = answer.answerText;
    this.answerButtonClicked(answer);
    this.cd.markForCheck();
  }

  ngOnDestroy(): void { }
}
