import { ChangeDetectorRef, ViewChild } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, Subscription, timer } from "rxjs";
import { filter, take, skipWhile } from "rxjs/operators";
import { Utils } from "shared-library/core/services";
import { UserActions } from "shared-library/core/store/actions";
import {
  Answer,
  ApplicationSettings,
  Category,
  Game,
  gamePlayConstants,
  GameStatus,
  OpponentType,
  PlayerMode,
  PlayerQnA,
  Question,
  User
} from "shared-library/shared/model";
import { appState, categoryDictionary } from "../../../store";
import { gamePlayState, GamePlayState } from "../../store";
import * as gameplayactions from "../../store/actions";
import { GameQuestionComponent } from "../game-question/game-question.component";
import { Router } from "@angular/router";

export class GameDialog {
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
  playerMode: any;

  MAX_TIME_IN_SECONDS: number;
  showContinueBtn = false;
  userDict: { [key: string]: User } = {};
  otherPlayer: User;
  otherPlayerUserId: string;
  RANDOM_PLAYER = "Random Player";
  showBadge = false;
  MAX_TIME_IN_SECONDS_LOADER = 2;
  MAX_TIME_IN_SECONDS_BADGE = 2;
  showLoader = true;
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
  showCurrentQuestion = false;
  showContinueDialogueForThreeConsecutiveAnswers = false;
  currentBadge = '';
  earnedBadges = [];
  earnedBadgesByOtherUser = [];
  totalBadges: string[];

  genQuestionComponent: GameQuestionComponent;
  isMobile = false;

  @ViewChild(GameQuestionComponent, { static: false }) set questionComponent(
    questionComponent: GameQuestionComponent
  ) {
    this.genQuestionComponent = questionComponent;
  }

  constructor(
    public store: Store<GamePlayState>,
    public userActions: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef,
    public router: Router
  ) {
    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(skipWhile( s => !s.user), take(1))
        .subscribe(s => (this.user = s.user))
    );
    this.userDict$ = store
      .select(appState.coreState)
      .pipe(select(s => s.userDict));
    this.subscriptions.push(
      this.userDict$.subscribe(userDict => {
        this.userDict = userDict;
        this.cd.markForCheck();
      })
    );

    this.resetValues();
    this.gameObs = store.select(gamePlayState).pipe(
      select(s => s.currentGame),
      filter(g => g != null)
    );
    this.gameQuestionObs = store
      .select(gamePlayState)
      .pipe(select(s => s.currentGameQuestion));

    this.subscriptions.push(
      this.store
        .select(categoryDictionary)
        .pipe(skipWhile(c => !c), take(1))
        .subscribe(c => (this.categoryDictionary = c))
    );
    this.subscriptions.push(
      this.gameObs.subscribe(game => {
        if (game) {
          this.showLoader = false;
          this.game = game;
          if (this.game.gameOptions.isBadgeWithCategory) {
            this.earnedBadges = this.game.stats[this.user.userId].badge;
            if (Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent) {
              const otherPlayerUserId = this.game.playerIds.filter(
                playerId => playerId !== this.user.userId
              )[0];
              if (otherPlayerUserId) {
                this.earnedBadgesByOtherUser = this.game.stats[otherPlayerUserId].badge;
              }
            }
          }
          this.playerMode = game.gameOptions.playerMode;
          this.threeConsecutiveAnswer = false;
          if (game !== null && game.playerQnAs.length === 3 && !game.gameOptions.isBadgeWithCategory) {
            let consecutiveCount = 0;
            this.game.playerQnAs.map(playerQnA => {
              consecutiveCount = playerQnA.answerCorrect
                ? ++consecutiveCount
                : consecutiveCount;
            });
            this.threeConsecutiveAnswer =
              consecutiveCount === 3 && this.game.round === 1 ? true : false;
          } else if (game !== null && game.stats[this.user.userId] &&
            game.stats[this.user.userId].badge.length === 3 && game.gameOptions.isBadgeWithCategory && this.game.round === 1 &&
            Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent) {
            let consecutiveCount = 0;
            const isUserIsNotFirstPlayer = this.game.playerQnAs.some(data => data.playerId !== this.user.userId);
            if (!isUserIsNotFirstPlayer) {
              this.game.playerQnAs.map(playerQnA => {
                consecutiveCount = playerQnA.answerCorrect && playerQnA.badge && playerQnA.playerId === this.user.userId
                  ? ++consecutiveCount
                  : consecutiveCount;
              });
              this.threeConsecutiveAnswer =
                consecutiveCount === 3 && this.game.round === 1 ? true : false;
            }
          }
          if (game !== null && !this.isGameLoaded) {
            this.turnFlag =
              this.game.GameStatus === GameStatus.STARTED ||
              this.game.GameStatus === GameStatus.RESTARTED ||
              ((this.game.GameStatus ===
                GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
                this.game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q ||
                this.game.GameStatus ===
                  GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE ||
                this.game.GameStatus === GameStatus.JOINED_GAME) &&
                this.game.nextTurnPlayerId === this.user.userId)
                ? false
                : true;
            this.gameOver = game.gameOver;

            if (!this.turnFlag) {
              this.questionIndex = this.game.playerQnAs.filter(
                p => p.playerId === this.user.userId
              ).length;
              this.correctAnswerCount = this.game.stats[this.user.userId].score;
            }

            this.totalRound =
              Number(this.game.gameOptions.playerMode) === PlayerMode.Single
                ? 8
                : 16;

            if (!game.gameOver) {
              this.setTurnStatusFlag();
            }
          }
        }
      })
    );

    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(select(s => s.applicationSettings))
        .subscribe(appSettings => {
          if (appSettings) {
            this.applicationSettings = appSettings[0];
            this.totalBadges =  Object.keys(this.applicationSettings.badges);
          }
        })
    );
  }

  resetValues() {
    this.questionIndex = 0;
    this.correctAnswerCount = 0;
    this.isCorrectAnswer = false;
    this.showWinBadge = false;
  }

  setTurnStatusFlag() {
    this.isGameLoaded = true;
    this.continueNext = this.questionAnswered ? true : false;
    this.showContinueBtn =
      this.questionAnswered && !this.turnFlag ? true : false;
    this.cd.markForCheck();
    this.checkGameOver();
    if (!this.gameOver) {
      if (!this.turnFlag) {
        if (
          this.userDict &&
          Number(this.game.gameOptions.playerMode) !== PlayerMode.Single
        ) {
          this.otherPlayerUserId = this.game.playerIds.filter(
            playerId => playerId !== this.user.userId
          )[0];
          const otherPlayerObj = this.userDict[this.otherPlayerUserId];
          if (otherPlayerObj) {
            this.otherPlayer = otherPlayerObj;
            this.otherPlayer["score"] = this.game.stats[
              this.otherPlayer.userId
            ].score;
          } else {
            this.initializeOtherUser();
          }
          this.otherPlayer.displayName =
            this.otherPlayer.displayName && this.otherPlayer.displayName !== ""
              ? this.otherPlayer.displayName
              : this.RANDOM_PLAYER;
        } else {
          this.initializeOtherUser();
        }

        if (this.game.playerQnAs.length > 0) {
          const timeoutFlag = this.game.playerQnAs[
            this.game.playerQnAs.length - 1
          ].playerAnswerInSeconds;
          this.isQuestionAvailable = timeoutFlag === undefined ? false : true;
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
            this.timerSub = timer(1000, 1000)
              .pipe(take(this.timer))
              .subscribe(
                t => {
                  this.timer--;
                  this.cd.markForCheck();
                },
                null,
                () => {
                  this.showLoader = false;
                  this.subscribeQuestion();
                  this.cd.markForCheck();
                  // this.cd.detectChanges();
                }
              );
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
      this.timerSub = timer(1000, 1000)
        .pipe(take(this.timer))
        .subscribe(
          t => {
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
          }
        );
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
    this.timerSub = timer(
      gamePlayConstants.GAME_Q_TIMER,
      gamePlayConstants.GAME_Q_TIMER
    )
      .pipe(take(this.timer))
      .subscribe(
        t => {
          this.timer--;
          this.cd.markForCheck();
        },
        null,
        () => {
          // Show badge screen
          this.utils.unsubscribe([this.timerSub]);
          if (this.game.gameOptions.isBadgeWithCategory) {
              this.questionSub = this.gameQuestionObs.subscribe(question => {
                if (question) {
                  this.setCurrentQuestion(question);
                  this.showNextBadgeToBeWon(question);
                }
              });
          } else {
            this.showNextBadgeToBeWon();
          }
        }
      );
  }

  showNextBadgeToBeWon(question?: Question) {
    this.showLoader = false;
    this.showBadge = true;
    this.timer = this.MAX_TIME_IN_SECONDS_BADGE;
    this.timerSub = timer(
      gamePlayConstants.GAME_Q_TIMER,
      gamePlayConstants.GAME_Q_TIMER
    )
      .pipe(take(this.timer))
      .subscribe(
        t => {
          this.timer--;
          this.cd.markForCheck();
        },
        null,
        () => {
          // load question screen timer
          this.utils.unsubscribe([this.timerSub]);
          this.showBadge = false;
          if (!this.game.gameOptions.isBadgeWithCategory) {
            this.subscribeQuestion();
          } else {
            this.displayQuestionAndStartTimer(question);
          }
          this.cd.detectChanges();
        }
      );
  }

  setContinueScreenVisibility(value: boolean) {
    this.showContinueScreen = value;
  }

  continueButtonClicked() {
    this.setContinueScreenVisibility(false);
    this.getNextQuestion();
    this.showBadgeScreen();
  }
  setCurrentQuestion(value?: Question) {
    if (value) {
      this.currentQuestion = value;
      this.showCurrentQuestion = true;
      // this.currentBadge = this.getCurrentBadge();
    } else {
      this.currentQuestion = undefined;
      this.showCurrentQuestion = false;
    }
  }

  subscribeQuestion() {
    this.questionSub = this.gameQuestionObs.subscribe(question => {
      this.displayQuestionAndStartTimer(question);
    });
  }

  displayQuestionAndStartTimer(question) {
      if (!question) {
        this.cd.markForCheck();
        this.setCurrentQuestion();
        return;
      }
      this.originalAnswers = Object.assign({}, question.answers);
      this.setCurrentQuestion(question);

      if (this.currentQuestion) {
        this.currentQuestion.answers.forEach((ans, index) => {
          ans.renderedAnswer = ans.answerText;
        });

        this.calculateMaxTime();
        this.timer = this.MAX_TIME_IN_SECONDS;
        this.currentQuestion.answers = this.utils.changeAnswerOrder(
          this.currentQuestion.answers
        );

        this.categoryName = question.categoryIds
          .map(category => {
            return this.categoryDictionary && this.categoryDictionary[category] ? this.categoryDictionary[category].categoryName : '';
          })
          .join(",");

        let remainSecond = this.MAX_TIME_IN_SECONDS;
        if (this.game && this.game.playerQnAs.length > 0) {
          const lastQuestionId = this.game.playerQnAs[
            this.game.playerQnAs.length - 1
          ].questionId;
          if (lastQuestionId === this.currentQuestion.id) {
            const addedOn = this.game.playerQnAs[
              this.game.playerQnAs.length - 1
            ].addedOn;
            if (addedOn) {
              let timeDiff = this.currentQuestion.serverTimeQCreated - addedOn;
              timeDiff = timeDiff < 0 ? 0 : Math.round(timeDiff / 1000);
              remainSecond = this.MAX_TIME_IN_SECONDS - timeDiff;
            }
          }
        }

        this.cd.markForCheck();
        if (this.isQuestionAvailable || remainSecond > 0) {
          this.questionIndex++;
          this.timer = remainSecond;
          this.timerSub = timer(1000, 1000)
            .pipe(take(this.timer))
            .subscribe(
              t => {
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
              }
            );
        } else {
          this.continueNext = true;
          this.showContinueBtn = true;
          setTimeout(() => {
            this.fillTimer();
          }, 100);
        }
      }
  }

  calculateMaxTime(): void {
    if (this.applicationSettings) {
      this.applicationSettings.game_play_timer_loader_ranges.forEach(
        timerLoader => {
          if (
            this.currentQuestion.totalQALength > timerLoader.start &&
            this.currentQuestion.totalQALength <= timerLoader.end
          ) {
            this.MAX_TIME_IN_SECONDS = timerLoader.seconds;
          }
        }
      );
    }
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
    if (
      Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent &&
      (Number(this.game.gameOptions.opponentType) === OpponentType.Random ||
        Number(this.game.gameOptions.opponentType) === OpponentType.Friend)
    ) {
      this.otherPlayerUserId = this.game.playerIds.filter(
        playerId => playerId !== this.user.userId
      )[0];
      if ((!this.game.gameOptions.isBadgeWithCategory &&  this.correctAnswerCount >= 5 ) ||
      (this.game.gameOptions.isBadgeWithCategory &&  this.earnedBadges.length >= 5 )) {
        // this.gameOverContinueClicked();
        this.setGameOver();
        this.cd.detectChanges();
      } else if (Number(this.game.round) === 16) {
        const players =  [...new Set(this.game.playerQnAs.filter(data => Number(data.round) === 16).map(data => data.playerId))];
        if (players.length >= 2 && !this.game.playerQnAs[this.game.playerQnAs.length - 1].answerCorrect) {
          this.setGameOver();
          this.cd.detectChanges();
        }
      } else if (Number(this.game.round) > 16) {
        this.setGameOver();
        this.cd.detectChanges();
      }
    } else if (
      (!this.game.gameOptions.isBadgeWithCategory &&
          (this.questionIndex - this.correctAnswerCount === 4 ||
           this.correctAnswerCount >= 5 ||
           this.questionIndex >= this.game.gameOptions.maxQuestions
           )
      ) ||
      (this.game.gameOptions.isBadgeWithCategory &&
        ( (this.game.round < this.game.gameOptions.maxQuestions && (this.game.round - this.earnedBadges.length === 4 && !this.game.playerQnAs[this.game.playerQnAs.length - 1].answerCorrect)) ||
        this.earnedBadges.length >= 5 ||
          (Number(this.game.round) === Number(this.game.gameOptions.maxQuestions) && !this.game.playerQnAs[this.game.playerQnAs.length - 1].answerCorrect) ||
          (this.game.round > this.game.gameOptions.maxQuestions)
        )
      )
    ) {
      this.setGameOver();
      // this.gameOverContinueClicked();
      this.cd.markForCheck();
    }
  }

  gameOverContinueClicked() {
    this.originalAnswers = undefined;
    this.questionAnswered = false;
    this.showContinueBtn = false;
    this.setCurrentQuestion();
  }

  setGameOver() {

    this.continueNext = false;
    this.isGameLoaded = false;
    this.gameOver = true;
    this.showWinBadge = false;
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(
      new gameplayactions.SetGameOver({
        playedGame: this.game,
        userId: this.user.userId,
        otherUserId: this.otherPlayerUserId
      })
    );
  }

  afterAnswer(userAnswerId?: number) {
    this.utils.unsubscribe([this.timerSub, this.questionSub]);
    this.cd.markForCheck();
    if (this.currentQuestion) {
      const correctAnswerId = this.currentQuestion.answers.findIndex(
        a => a.correct
      );
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

      // badge.won = userAnswerId === correctAnswerId;
      const playerQnA: PlayerQnA = {
        playerId: this.user.userId,
        // playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
        playerAnswerId: index
          ? originalAnswers
              .findIndex(
                a =>
                  a.answerText ===
                  this.currentQuestion.answers[index].answerText
              )
              .toString()
          : null,
        playerAnswerInSeconds: seconds,
        answerCorrect: userAnswerId === correctAnswerId,
        questionId: this.currentQuestion.id,
        addedOn: this.currentQuestion.addedOn,
        round: this.currentQuestion.gameRound
      };

      if (this.game && this.game.gameOptions.isBadgeWithCategory) {
        playerQnA.categoryId = this.game.playerQnAs[this.game.playerQnAs.length - 1].categoryId;
        if (this.game.playerQnAs[this.game.playerQnAs.length - 1].badge) {
        const badge = this.game.playerQnAs[this.game.playerQnAs.length - 1].badge;
        badge.won = userAnswerId === correctAnswerId;
        playerQnA.badge = badge;
      }
    }

      // if (badgeWon === '') {
      //   this.earnedBadges.push(badgeWon);
      // }
      this.questionAnswered = true;
      this.isGameLoaded = false;
      // dispatch action to push player answer
      this.store.dispatch(
        new gameplayactions.AddPlayerQnA({
          gameId: this.game.gameId,
          playerQnA: playerQnA
        })
      );
      if (this.genQuestionComponent) {
        this.genQuestionComponent.disableQuestions(correctAnswerId);
        setTimeout(() => {
          this.cd.markForCheck();
        }, 0);
      }
    }
  }

  fillTimer() {
    this.afterAnswer();
    if (this.genQuestionComponent) {
      this.genQuestionComponent.fillTimer();
    }
    this.cd.markForCheck();
  }

  continueGame() {
    this.originalAnswers = undefined;
    this.setCurrentQuestion();
    if (this.turnFlag) {
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentGame());
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.store.dispatch(
        new gameplayactions.UpdateGameRound(this.game.gameId)
      );
      this.showContinueScreen = true;
      if (!this.isMobile) {
      this.router.navigate(["/dashboard"]);
      }
    } else {
      this.questionAnswered = false;
      this.showContinueBtn = false;
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.checkGameOver();
      if (!this.gameOver) {
        this.getLoader(false);
      }
    }
  }


  continueClicked($event) {
    this.continueGame();
    if (this.showLoader) {
      this.cd.markForCheck();
    }
  }

  gameOverButtonClicked($event) {
    this.showCurrentQuestion = false;
    this.resetValues();
    this.gameOverContinueClicked();
  }

  destroy() {
    this.user = undefined;
    this.gameObs = undefined;
    this.game = undefined;
    this.gameQuestionObs = undefined;
    this.currentQuestion = undefined;
    this.showCurrentQuestion = false;
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
    this.showContinueDialogueForThreeConsecutiveAnswers = undefined;
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
    this.utils.unsubscribe([this.timerSub, this.questionSub]);
  }
}
