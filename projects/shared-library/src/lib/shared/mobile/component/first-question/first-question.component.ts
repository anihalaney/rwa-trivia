import { Component, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Question, Answer, User, ApplicationSettings } from 'shared-library/shared/model';
import { CoreState, coreState, categoryDictionary } from './../../../../core/store';
import { Store, select } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';
import { map, flatMap, filter } from 'rxjs/operators';
import { UserActions } from 'shared-library/core/store';
import { GameActions } from 'shared-library/core/store';

@Component({
  selector: 'first-question',
  templateUrl: './first-question.component.html',
  styleUrls: ['./first-question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class FirstQuestionComponent implements OnInit, OnDestroy {
  user: User;
  setFirstQuestionBitsObs: Observable<any>;
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
    private store: Store<CoreState>,
    private utils: Utils,
    private cd: ChangeDetectorRef,
    public routerExtension: RouterExtensions,
    private userAction: UserActions,
    public gameActions: GameActions
  ) { }

  ngOnInit() {
    this.answeredText = '';
    this.correctAnswerText = '';
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          this.cd.markForCheck();
        }
      }));



    this.subscriptions.push(this.store.select(categoryDictionary).pipe(map(categories => {
      if (categories) {
        this.categoryDictionary = categories;
      }

    }),
      flatMap(() => this.store.select(coreState).pipe(select(s => s.firstQuestion)))).subscribe((question: Question) => {
        if (question) {
          this.question = question;
          this.cd.markForCheck();
          this.question.answers = this.utils.changeAnswerOrder(
            question.answers
          );
          if (this.question.answers) {
            this.question.answers.forEach(item => {
              if (item.correct === true) {
                this.correctAnswerText = item.answerText;
              }
            });
          }
          if (this.question.categoryIds) {
            this.categoryName = this.question.categoryIds
              .map(category => {
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
      })
    );

    this.userDict$ = this.store.select(coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => (this.userDict = userDict)));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
    }));
    this.setFirstQuestionBitsObs = this.store.select(coreState).pipe(select(s => s.firstQuestionBits));
    this.subscriptions.push(this.setFirstQuestionBitsObs.pipe(filter(result => result !== null)).subscribe(setBits => {
      if (setBits) {
        this.routerExtension.navigate(['/user/my/app-invite-friends-dialog', { showSkip: true }]);
        this.cd.markForCheck();
      }
    }));
  }

  answerButtonClicked(answer: Answer) {
    if (this.doPlay) {
      this.answeredText = answer.answerText;
      this.doPlay = false;
      const index = this.question.answers.findIndex(
        x => x.answerText === answer.answerText
      );
      this.answerClicked.emit(index);
      if (this.answeredText === this.correctAnswerText) {
        this.store.dispatch(
          this.gameActions.UpdateQuestionStat(this.question.id, 'CORRECT')
        );
      } else {
        this.store.dispatch(
          this.gameActions.UpdateQuestionStat(this.question.id, 'WRONG')
        );
      }
      this.cd.markForCheck();
    }
  }

  rippleTap(answer) {
    this.answerButtonClicked(answer);
  }

  selectedAnswer(answer: Answer) {
    this.answeredText = answer.answerText;
    this.cd.markForCheck();
  }

  goToNextStep(nextStep) {
    if (
      nextStep === 'continue' &&
      this.correctAnswerText === this.answeredText
    ) {
      this.store.dispatch(this.userAction.setFirstQuestionBits(this.user.userId));
    } else {
      this.routerExtension.navigate(['/user/my/app-invite-friends-dialog', { showSkip: true }]);
    }
  }

  ngOnDestroy(): void { }
}
