import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Question, Answer, User, ApplicationSettings } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary } from '../../../../../../../trivia/src/app/store';
import { Store, select } from '@ngrx/store';
import { QuestionActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';
import { map, flatMap } from 'rxjs/operators';

@Component({
  selector: 'first-question',
  templateUrl: './first-question.component.html',
  styleUrls: ['./first-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class FirstQuestionComponent implements OnInit, OnDestroy {
  question: Question;
  categoryName: string;

  userDict: { [key: string]: User };

  @Output() answerClicked = new EventEmitter<number>();
  @Output() continueClicked = new EventEmitter();

  answeredText: string;
  correctAnswerText: string;
  doPlay = true;
  categoryDictionary: any;
  subscriptions = [];
  applicationSettings: ApplicationSettings;
  userDict$: Observable<{ [key: string]: User }>;

  constructor(
    private store: Store<AppState>,
    private questionAction: QuestionActions,
    private utils: Utils,
    private cd: ChangeDetectorRef,
    public routerExtension: RouterExtensions) {

  }

  ngOnInit() {
    this.store.dispatch(this.questionAction.getQuestionOfTheDay());
    this.answeredText = '';
    this.correctAnswerText = '';
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          this.cd.markForCheck();
        }
      }));

    this.store.select(categoryDictionary).pipe(map(categories => {
      this.categoryDictionary = categories;
    }),
      flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.questionOfTheDay)))).subscribe((question: Question) => {
        if (question) {
          this.question = question;
          this.cd.markForCheck();
          this.question.answers = this.utils.changeAnswerOrder(question.answers);
          if (this.question.answers) {
            this.question.answers.forEach((item) => {
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
      });

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

  }

  answerButtonClicked(answer: Answer) {
    if (this.doPlay) {
      this.answeredText = answer.answerText;
      this.doPlay = false;
      const index = this.question.answers.findIndex(x => x.answerText === answer.answerText);
      this.answerClicked.emit(index);
      this.cd.markForCheck();
    }
  }

  rippleTap(answer) {
    this.answerButtonClicked(answer);
  }

  selectedAnswer(answeredText) {
    this.answeredText = answeredText;
    // this.correctAnswerText
    this.cd.markForCheck();
  }

  goToDashboard(nextStep) {
    this.routerExtension.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {

  }

}

