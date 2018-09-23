import { Component, Inject, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription, timer } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as gameplayactions from '../../store/actions';

import { gameplayState, GamePlayState } from '../../store';

import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions, UserActions } from '../../../../../../shared-library/src/lib/core/store/actions';
import {
  Game, GameOptions, GameMode, PlayerQnA, User, Question, Category, GameStatus,
  PlayerMode, OpponentType
} from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';


@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent implements OnInit, OnDestroy {
  user: User;
  gameObs: Observable<Game>;
  game: Game;
  gameQuestionObs: Observable<Question>;
  currentQuestion: Question;
  correctAnswerCount: number;
  totalRound: number;
  questionIndex: number;
  sub: Subscription[] = [];
  timerSub: Subscription;
  questionSub: Subscription;
  timer: number;
  categoryDictionary: { [key: number]: Category }
  categoryName: string;
  continueNext = false;
  questionAnswered = false;
  gameOver = false;
  PlayerMode = PlayerMode;

  MAX_TIME_IN_SECONDS = 16;
  showContinueBtn = false;
  userDict: { [key: string]: User } = {};
  otherPlayer: User;
  otherPlayerUserId: string;
  RANDOM_PLAYER = 'Random Player';
  showBadge = false;
  MAX_TIME_IN_SECONDS_LOADER = 2;
  MAX_TIME_IN_SECONDS_BADGE = 1;
  showLoader = false;
  showWinBadge = false;
  isCorrectAnswer = false;
  turnFlag: boolean;
  userDict$: Observable<{ [key: string]: User }>;
  isQuestionAvailable = true;
  isGameLoaded: boolean;
  threeConsecutiveAnswer = false;

  private genQuestionComponent: GameQuestionComponent;

  @ViewChild(GameQuestionComponent) set questionComponent(questionComponent: GameQuestionComponent) {
    this.genQuestionComponent = questionComponent;
  };

  constructor(private store: Store<GamePlayState>, private gameActions: GameActions, private router: Router,
    private appStore: Store<AppState>, private userActions: UserActions,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.user = data.user;
    this.userDict = data.userDict;

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.sub.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict
    }));

    this.resetValues();
    this.gameObs = store.select(gameplayState).pipe(select(s => s.currentGame), filter(g => g != null));
    this.gameQuestionObs = store.select(gameplayState).pipe(select(s => s.currentGameQuestion));


    this.sub.push(this.store.select(categoryDictionary).pipe(take(1)).subscribe(c => { this.categoryDictionary = c }));
    this.sub.push(
      this.gameObs.subscribe(game => {
        this.game = game;
        this.threeConsecutiveAnswer = false;
        if (game !== null && game.playerQnAs.length === 3) {
          let consecutiveCount = 0;
          this.game.playerQnAs.map((playerQnA) => {
            consecutiveCount = (playerQnA.answerCorrect) ? ++consecutiveCount : consecutiveCount;
          });
          this.threeConsecutiveAnswer = (consecutiveCount === 3) ? true : false;
        }
        if (game !== null && !this.isGameLoaded) {
          this.turnFlag = (this.game.GameStatus === GameStatus.STARTED ||
            this.game.GameStatus === GameStatus.RESTARTED ||
            ((this.game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
              this.game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q ||
              this.game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE ||
              this.game.GameStatus === GameStatus.JOINED_GAME)
              && this.game.nextTurnPlayerId === this.user.userId)) ? false : true;
          this.gameOver = game.gameOver;

          if (!this.turnFlag) {
            this.questionIndex = this.game.playerQnAs.filter((p) => p.playerId === this.user.userId).length;
            this.correctAnswerCount = this.game.stats[this.user.userId].score;
          }

          this.totalRound = (Number(this.game.gameOptions.playerMode) === PlayerMode.Single) ? 8 : 16;

          if (!game.gameOver) {
            this.setTurnStatusFlag();
          } else {
            this.resetValues();
          }
        }

      }));

  }

  resetValues() {
    this.questionIndex = 0;
    this.correctAnswerCount = 0;
    this.isCorrectAnswer = false;
    this.showWinBadge = false;

  }


  setTurnStatusFlag() {
    this.isGameLoaded = true;
    this.continueNext = (this.questionAnswered) ? true : false;
    this.showContinueBtn = (this.questionAnswered && !this.turnFlag) ? true : false;
    this.checkGameOver();
    if (!this.gameOver) {
      if (!this.turnFlag) {

        if (this.userDict && Number(this.game.gameOptions.playerMode) !== PlayerMode.Single) {
          this.otherPlayerUserId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
          const otherPlayerObj = this.userDict[this.otherPlayerUserId];
          (otherPlayerObj) ? this.otherPlayer = otherPlayerObj : this.initializeOtherUser();
          this.otherPlayer.displayName = (this.otherPlayer.displayName && this.otherPlayer.displayName !== '') ?
            this.otherPlayer.displayName : this.RANDOM_PLAYER
        } else {
          this.initializeOtherUser();
        }

        if (this.game.playerQnAs.length > 0) {
          const timeoutFlag = this.game.playerQnAs[this.game.playerQnAs.length - 1].playerAnswerInSeconds;
          this.isQuestionAvailable = (timeoutFlag === undefined) ? false : true;
        }

        if (!this.currentQuestion) {
          (this.isQuestionAvailable) ? this.getLoader() : '';
          this.getNextQuestion();
          if (!this.isQuestionAvailable) {
            this.showLoader = true;
            this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
            this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
              this.timer--;
            },
              null,
              () => {
                this.showLoader = false;
                this.subscribeQuestion();
              });
          }
        }
      } else {
        this.showContinueBtn = true;

      }
    }
  }

  initializeOtherUser() {
    this.otherPlayer = new User();
  }

  getLoader() {
    // Show Loading screen
    if (this.isCorrectAnswer) {
      this.showWinBadge = true;
      this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
      this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
        this.timer--;
      },
        null,
        () => {
          Utils.unsubscribe([this.timerSub]);
          this.showWinBadge = false;
          this.isCorrectAnswer = false;
          this.showBadgeScreen();
        });
    } else {
      this.showBadgeScreen();
    }

  }

  showBadgeScreen() {
    // Show Loading screen
    this.showLoader = true;
    this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
    this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
      this.timer--;
    },
      null,
      () => {
        // Show badge screen
        Utils.unsubscribe([this.timerSub]);
        this.showLoader = false;
        this.showBadge = true;
        this.timer = this.MAX_TIME_IN_SECONDS_BADGE;
        this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
          this.timer--;
        },
          null,
          () => {
            // load question screen timer
            Utils.unsubscribe([this.timerSub]);
            this.showBadge = false;
            this.subscribeQuestion();
          })
      });
  }

  subscribeQuestion() {
    this.timer = this.MAX_TIME_IN_SECONDS;
    this.questionSub = this.gameQuestionObs.subscribe(question => {
      if (!question) {
        this.currentQuestion = undefined;
        return;
      }

      this.currentQuestion = question;
      this.categoryName = this.categoryDictionary[question.categoryIds[0]].categoryName;
      if (!this.userDict[this.currentQuestion.created_uid]) {
        this.store.dispatch(this.userActions.loadOtherUserProfile(this.currentQuestion.created_uid));
      }
      if (this.isQuestionAvailable) {
        this.questionIndex++;
        this.timerSub =
          timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
            this.timer--;
          },
            null,
            () => {
              // disable all buttons
              if (this.currentQuestion) {
                this.afterAnswer();
                this.genQuestionComponent.fillTimer();
              }
            });
      } else {
        setTimeout(() => {
          this.afterAnswer();
          this.genQuestionComponent.fillTimer();
        }, 1000);
      }
    });
  }

  ngOnInit() {

  }

  getNextQuestion() {
    this.store.dispatch(new gameplayactions.GetNextQuestion(this.game));
  }

  answerClicked($event: number) {
    // disable all buttons
    this.afterAnswer($event);
  }

  okClick($event) {
    if (this.questionIndex >= this.game.gameOptions.maxQuestions) {
      this.gameOver = true;
    } else {
      this.continueNext = true;
    }

  }

  continueClicked($event) {
    this.currentQuestion = undefined;
    if (this.turnFlag) {
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentGame());
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.store.dispatch(new gameplayactions.UpdateGameRound(this.game.gameId));
      this.router.navigate(['/dashboard'])
    } else {
      this.questionAnswered = false;
      this.showContinueBtn = false;
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.checkGameOver();
      if (!this.gameOver) {
        this.getLoader();
        this.getNextQuestion();
      }
    }
  }

  checkGameOver() {
    if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent
      && (Number(this.game.gameOptions.opponentType) === OpponentType.Random ||
        Number(this.game.gameOptions.opponentType) === OpponentType.Friend)) {
      this.otherPlayerUserId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
      if (this.correctAnswerCount >= 5 ||
        (this.game.round >= 16)) {
        this.gameOverContinueClicked();
      }
    } else if (((this.questionIndex - this.correctAnswerCount) === 4) ||
      this.correctAnswerCount >= 5 ||
      this.questionIndex >= this.game.gameOptions.maxQuestions) {
      this.gameOverContinueClicked();
    }
  }


  gameOverContinueClicked() {
    this.currentQuestion = undefined;
    this.questionAnswered = false;
    this.showContinueBtn = false;
    this.continueNext = false;
    this.isGameLoaded = false;
    this.gameOver = true;
    this.showWinBadge = false;
    this.store.dispatch(new gameplayactions.SetGameOver(this.game.gameId));
  }

  afterAnswer(userAnswerId?: number) {
    Utils.unsubscribe([this.timerSub, this.questionSub]);
    const correctAnswerId = this.currentQuestion.answers.findIndex(a => a.correct);
    let index;
    if (userAnswerId === undefined) {
      index = null;
    } else {
      index = userAnswerId.toString();
    }

    if (userAnswerId === correctAnswerId) {
      this.isCorrectAnswer = true;
      this.correctAnswerCount++;
    }

    const seconds = this.MAX_TIME_IN_SECONDS - this.timer;
    const playerQnA: PlayerQnA = {
      playerId: this.user.userId,
      // playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
      playerAnswerId: index,
      playerAnswerInSeconds: seconds,
      answerCorrect: (userAnswerId === correctAnswerId),
      questionId: this.currentQuestion.id,
      addedOn: this.currentQuestion.addedOn,
      round: this.currentQuestion.gameRound
    }
    this.questionAnswered = true;
    this.isGameLoaded = false;
    // dispatch action to push player answer
    this.store.dispatch(new gameplayactions.AddPlayerQnA({ 'gameId': this.game.gameId, 'playerQnA': playerQnA }));

    this.genQuestionComponent.disableQuestions(correctAnswerId);
  }


  ngOnDestroy() {
    Utils.unsubscribe([this.timerSub]);
    Utils.unsubscribe(this.sub);
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
  }
}
