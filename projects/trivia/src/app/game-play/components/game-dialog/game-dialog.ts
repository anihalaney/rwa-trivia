import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import {
  Answer, ApplicationSettings, Category, Game, gamePlayConstants,
  GameStatus, OpponentType, PlayerMode, PlayerQnA, Question, User
} from 'shared-library/shared/model';
import { appState, categoryDictionary } from '../../../store';
import { gamePlayState, GamePlayState } from '../../store';
import * as gameplayactions from '../../store/actions';
import { GameQuestionComponent } from '../game-question/game-question.component';


export class GameDialog {
  actionBarStatus: String = 'Play Game';
  user: User;
  gameObs: Observable<Game>;
  game: Game;
  gameQuestionObs: Observable<Question>;
  currentQuestion: Question;
  originalAnswers: Answer[];
  correctAnswerCount: number;
  totalRound: number;
  questionIndex: number;
  subscriptions: Subscription[] = [];
  timerSub: Subscription;
  questionSub: Subscription;
  timer: number;
  categoryDictionary: { [key: number]: Category };
  categoryName: string;
  continueNext = false;
  questionAnswered = false;
  gameOver = false;
  PlayerMode = PlayerMode;

  MAX_TIME_IN_SECONDS: number;
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
  currentUTC: number;
  applicationSettings: ApplicationSettings;


  showContinueScreen = false;

  private genQuestionComponent: GameQuestionComponent;

  @ViewChild(GameQuestionComponent) set questionComponent(questionComponent: GameQuestionComponent) {
    this.genQuestionComponent = questionComponent;
  }

  constructor(public store: Store<GamePlayState>, public userActions: UserActions, public utils: Utils, public cd: ChangeDetectorRef) {

    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      // this.cd.detectChanges();
    }));

    this.resetValues();
    this.gameObs = store.select(gamePlayState).pipe(select(s => s.currentGame), filter(g => g != null));
    this.gameQuestionObs = store.select(gamePlayState).pipe(select(s => s.currentGameQuestion));


    this.subscriptions.push(this.store.select(categoryDictionary).pipe(take(1)).subscribe(c => this.categoryDictionary = c));
    this.subscriptions.push(
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

          if (game.GameStatus === GameStatus.COMPLETED) {
            this.actionBarStatus = 'Game Over';
          } else {
            this.actionBarStatus = 'Play Game';
          }
        }

      }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
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
    this.cd.markForCheck();
    this.checkGameOver();
    if (!this.gameOver) {
      if (!this.turnFlag) {
        if (this.userDict && Number(this.game.gameOptions.playerMode) !== PlayerMode.Single) {
          this.otherPlayerUserId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
          const otherPlayerObj = this.userDict[this.otherPlayerUserId];
          (otherPlayerObj) ? this.otherPlayer = otherPlayerObj : this.initializeOtherUser();
          this.otherPlayer.displayName = (this.otherPlayer.displayName && this.otherPlayer.displayName !== '') ?
            this.otherPlayer.displayName : this.RANDOM_PLAYER;
        } else {
          this.initializeOtherUser();
        }

        if (this.game.playerQnAs.length > 0) {
          const timeoutFlag = this.game.playerQnAs[this.game.playerQnAs.length - 1].playerAnswerInSeconds;
          this.isQuestionAvailable = (timeoutFlag === undefined) ? false : true;
        }

        if (!this.currentQuestion) {
          this.getNextQuestion();
          if (this.isQuestionAvailable) {
            this.getLoader(true);
          }
          this.cd.markForCheck();
          if (!this.isQuestionAvailable) {
            this.showLoader = true;
            this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
            this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
              this.timer--;
              this.cd.markForCheck();
            },
              null,
              () => {
                this.showLoader = false;
                this.subscribeQuestion();
                this.cd.markForCheck();
                // this.cd.detectChanges();
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

  getLoader(isLoadContinueScreen: boolean) {
    // Show Loading screen
    if (this.isCorrectAnswer) {
      this.showWinBadge = true;
      this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
      this.timerSub = timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
        this.timer--;
        this.cd.markForCheck();
      },
        null,
        () => {
          this.utils.unsubscribe([this.timerSub]);
          this.showWinBadge = false;
          this.isCorrectAnswer = false;
          // this.showBadgeScreen();
          this.setContinueScreenVisibility(true);
          this.cd.markForCheck();
        });
    } else {
      if (isLoadContinueScreen) {
        this.showBadgeScreen();
      } else {
        this.setContinueScreenVisibility(true);
      }
    }

  }

  showBadgeScreen() {
    // Show Loading screen
    this.showLoader = true;
    this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
    this.timerSub = timer(gamePlayConstants.GAME_Q_TIMER, gamePlayConstants.GAME_Q_TIMER).pipe(take(this.timer)).subscribe(t => {
      this.timer--;
      this.cd.markForCheck();
    },
      null,
      () => {
        // Show badge screen
        this.utils.unsubscribe([this.timerSub]);
        this.showLoader = false;
        this.showBadge = true;
        this.timer = this.MAX_TIME_IN_SECONDS_BADGE;
        this.timerSub = timer(gamePlayConstants.GAME_Q_TIMER, gamePlayConstants.GAME_Q_TIMER).pipe(take(this.timer)).subscribe(t => {
          this.timer--;
          this.cd.markForCheck();
        },
          null,
          () => {
            // load question screen timer
            this.utils.unsubscribe([this.timerSub]);
            this.showBadge = false;
            this.subscribeQuestion();
            this.cd.detectChanges();
          });
      });
  }

  setContinueScreenVisibility(value: boolean) {
    this.showContinueScreen = value;
  }

  continueButtonClicked() {
    this.setContinueScreenVisibility(false);
    this.getNextQuestion();
    this.showBadgeScreen();
  }

  subscribeQuestion() {

    this.questionSub = this.gameQuestionObs.subscribe(question => {
      if (!question) {
        this.cd.markForCheck();
        this.currentQuestion = undefined;
        return;
      }
      this.originalAnswers = Object.assign({}, question.answers);
      this.currentQuestion = question;
      this.calculateMaxTime();
      this.timer = this.MAX_TIME_IN_SECONDS;
      this.currentQuestion.answers = this.utils.changeAnswerOrder(this.currentQuestion.answers);
      if (!this.userDict[this.currentQuestion.created_uid]) {
        this.store.dispatch(this.userActions.loadOtherUserProfile(this.currentQuestion.created_uid));
      }
      this.categoryName = question.categoryIds.map(category => {
        return this.categoryDictionary[category].categoryName;
      }).join(',');

      let remainSecond = this.MAX_TIME_IN_SECONDS;
      if (this.game.playerQnAs.length > 0) {
        const lastQuestionId = this.game.playerQnAs[this.game.playerQnAs.length - 1].questionId;
        if (lastQuestionId === this.currentQuestion.id) {
          const addedOn = this.game.playerQnAs[this.game.playerQnAs.length - 1].addedOn;
          if (addedOn) {
            let timeDiff = this.currentQuestion.serverTimeQCreated - addedOn;
            timeDiff = (timeDiff < 0) ? 0 : Math.round((timeDiff / 1000));
            remainSecond = this.MAX_TIME_IN_SECONDS - timeDiff;
          }
        }
      }

      this.cd.markForCheck();
      if (this.isQuestionAvailable || remainSecond > 0) {
        this.questionIndex++;
        this.timer = remainSecond;
        this.timerSub =
          timer(1000, 1000).pipe(take(this.timer)).subscribe(t => {
            this.timer--;
            this.cd.markForCheck();
            if (this.timer < 1) {
              this.fillTimer();
            }
          },
            null,
            () => {
              // disable all buttons
              if (this.currentQuestion) {
                this.fillTimer();
              }
            });
      } else {
        this.continueNext = true;
        this.showContinueBtn = true;
        setTimeout(() => {
          this.fillTimer();
        }, 100);
      }
    });
  }

  calculateMaxTime(): void {
    this.applicationSettings.game_play_timer_loader_ranges.forEach((timerLoader) => {
      if (this.currentQuestion.totalQALength > timerLoader.start && this.currentQuestion.totalQALength <= timerLoader.end) {
        this.MAX_TIME_IN_SECONDS = timerLoader.seconds;
      }
    });

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

  checkGameOver() {
    if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent
      && (Number(this.game.gameOptions.opponentType) === OpponentType.Random ||
        Number(this.game.gameOptions.opponentType) === OpponentType.Friend)) {
      this.otherPlayerUserId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
      if (this.correctAnswerCount >= 5 ||
        (this.game.round >= 16)) {
        this.gameOverContinueClicked();
        this.cd.detectChanges();
      }
    } else if (((this.questionIndex - this.correctAnswerCount) === 4) ||
      this.correctAnswerCount >= 5 ||
      this.questionIndex >= this.game.gameOptions.maxQuestions) {
      this.gameOverContinueClicked();
      this.cd.markForCheck();
    }
  }


  gameOverContinueClicked() {
    this.currentQuestion = undefined;
    this.originalAnswers = undefined;
    this.questionAnswered = false;
    this.showContinueBtn = false;
    this.continueNext = false;
    this.isGameLoaded = false;
    this.gameOver = true;
    this.showWinBadge = false;
    this.store.dispatch(new gameplayactions.SetGameOver(this.game.gameId));
  }

  afterAnswer(userAnswerId?: number) {
    this.utils.unsubscribe([this.timerSub, this.questionSub]);
    this.cd.markForCheck();
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
    const originalAnswers: Answer[] = [];
    for (const key of Object.keys(this.originalAnswers)) {
      const originalAnswer: Answer = this.originalAnswers[key];
      originalAnswers[key] = originalAnswer;
    }

    const playerQnA: PlayerQnA = {
      playerId: this.user.userId,
      // playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
      playerAnswerId: (index) ?
        originalAnswers.findIndex(a => a.answerText === this.currentQuestion.answers[index].answerText).toString() : null,
      playerAnswerInSeconds: seconds,
      answerCorrect: (userAnswerId === correctAnswerId),
      questionId: this.currentQuestion.id,
      addedOn: this.currentQuestion.addedOn,
      round: this.currentQuestion.gameRound
    };
    this.questionAnswered = true;
    this.isGameLoaded = false;
    // dispatch action to push player answer
    this.store.dispatch(new gameplayactions.AddPlayerQnA({ 'gameId': this.game.gameId, 'playerQnA': playerQnA }));

    this.genQuestionComponent.disableQuestions(correctAnswerId);
    setTimeout(() => {
      this.cd.markForCheck();
    }, 0);
  }

  fillTimer() {
    this.afterAnswer();
    this.genQuestionComponent.fillTimer();
    this.cd.markForCheck();
  }

  destroy() {
    this.user = undefined;
    this.gameObs = undefined;
    this.game = undefined;
    this.gameQuestionObs = undefined;
    this.currentQuestion = undefined;
    this.originalAnswers = [];
    this.correctAnswerCount = undefined;
    this.totalRound = undefined;
    this.questionIndex = undefined;
    this.timerSub = undefined;
    this.questionSub = undefined;
    this.timer = undefined;
    this.categoryName = undefined;
    this.continueNext = undefined;
    this.questionAnswered = undefined;
    this.gameOver = undefined;
    this.PlayerMode = undefined;

    this.MAX_TIME_IN_SECONDS = undefined;
    this.showContinueBtn = undefined;
    this.otherPlayer = undefined;
    this.otherPlayerUserId = undefined;
    this.showBadge = undefined;
    this.MAX_TIME_IN_SECONDS_LOADER = undefined;
    this.MAX_TIME_IN_SECONDS_BADGE = undefined;
    this.showLoader = undefined;
    this.showWinBadge = undefined;
    this.isCorrectAnswer = undefined;
    this.turnFlag = undefined;

    this.isQuestionAvailable = undefined;
    this.isGameLoaded = undefined;
    this.threeConsecutiveAnswer = undefined;
    this.currentUTC = undefined;
    this.applicationSettings = undefined;

    this.genQuestionComponent = undefined;
  }

}
