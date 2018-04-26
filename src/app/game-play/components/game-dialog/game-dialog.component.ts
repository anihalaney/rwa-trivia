import { Component, Inject, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import * as gameplayactions from '../../store/actions';
import { categoryDictionary } from '../../../store';
import { gameplayState, GamePlayState } from '../../store';

import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import {
  Game, GameOptions, GameMode, PlayerQnA,
  User, Question, Category, GameStatus,
  PlayerMode, OpponentType
} from '../../../model';

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
  questionIndex: number;
  sub: Subscription[] = [];
  timerSub: Subscription;
  timer: number;
  categoryDictionary: { [key: number]: Category }
  categoryName: string;
  continueNext = false;
  questionAnswered = false;
  gameOver = false;

  MAX_TIME_IN_SECONDS = 16;
  showContinueBtn = false;
  userDict: { [key: string]: User } = {};
  otherPlayer: User;
  otherPlayerUserId: string;
  RANDOM_PLAYER = 'Random Player';
  showBadge = false;
  MAX_TIME_IN_SECONDS_LOADER = 2;
  MAX_TIME_IN_SECONDS_BADGE = 1;
  showLoader = true;

  @ViewChild(GameQuestionComponent)
  private questionComponent: GameQuestionComponent;

  constructor(private store: Store<GamePlayState>, private gameActions: GameActions, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.user = data.user;
    this.userDict = data.userDict;

    this.questionIndex = 0;
    this.correctAnswerCount = 0;
    this.gameObs = store.select(gameplayState).select(s => s.currentGame).filter(g => g != null);
    this.gameQuestionObs = store.select(gameplayState).select(s => s.currentGameQuestion);


    this.store.select(categoryDictionary).take(1).subscribe(c => { this.categoryDictionary = c });
    this.sub.push(
      this.gameObs.subscribe(game => {
        if (game !== null) {
          this.game = game;
          this.gameOver = game.gameOver;
          this.questionIndex = this.game.playerQnAs.filter((p) => p.playerId === this.user.userId).length;
          this.correctAnswerCount = this.game.stats[this.user.userId].score;
          this.setTurnStatusFlag();
        }
      }));

    this.sub.push(
      this.gameQuestionObs.subscribe(question => {
        if (!question) {
          this.currentQuestion = null;
          return;
        }
        this.getLoader();
        this.currentQuestion = question;
        this.questionIndex++;
        this.categoryName = this.categoryDictionary[question.categoryIds[0]].categoryName



      })
    );
  }

  getLoader() {
    // Show Loading screen
    this.showLoader = true;
    this.timer = this.MAX_TIME_IN_SECONDS_LOADER;
    this.timerSub = Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
      this.timer--;
    },
      null,
      () => {
        // Show badge screen
        Utils.unsubscribe([this.timerSub]);
        this.showLoader = false;
        this.showBadge = true;
        this.timer = this.MAX_TIME_IN_SECONDS_BADGE;
        this.timerSub = Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
          this.timer--;
        },
          null,
          () => {
            // load question screen timer
            Utils.unsubscribe([this.timerSub]);
            this.showBadge = false;
            this.timer = this.MAX_TIME_IN_SECONDS;
            this.timerSub =
              Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
                this.timer--;
              },
                null,
                () => {
                  // disable all buttons
                  (this.currentQuestion) ?
                    this.afterAnswer() : '';
                });
          })
      });
  }

  ngOnInit() {

  }

  setTurnStatusFlag() {
    const turnFlag = (this.game.GameStatus === GameStatus.STARTED || this.game.GameStatus === GameStatus.JOINED_GAME ||
      (this.game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q && this.game.nextTurnPlayerId === this.user.userId)) ? false : true;
    this.continueNext = (this.questionAnswered) ? true : false;
    this.showContinueBtn = (this.questionAnswered && !turnFlag) ? true : false;
    this.checkGameOver();
    if (!turnFlag && !this.gameOver) {

      if (!this.currentQuestion) {
        this.getNextQuestion();
      }
      if (this.game.GameStatus !== GameStatus.STARTED && this.userDict) {
        this.otherPlayerUserId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
        const otherPlayerObj = this.userDict[this.otherPlayerUserId];
        (otherPlayerObj) ? this.otherPlayer = otherPlayerObj : this.initializeOtherUser();
        this.otherPlayer.displayName = (this.otherPlayer.displayName && this.otherPlayer.displayName !== '') ?
          this.otherPlayer.displayName : this.RANDOM_PLAYER
      } else {
        this.initializeOtherUser();
      }
    } else {
      Observable.timer(2000).take(1).subscribe(t => {

        this.store.dispatch(new gameplayactions.ResetCurrentGame());
        this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
        this.currentQuestion = undefined;
        this.continueNext = false;
        this.router.navigate(['/dashboard']);
      });
      Utils.unsubscribe([this.timerSub]);
    }


  }

  initializeOtherUser() {
    this.otherPlayer = new User();
    this.otherPlayer.displayName = this.RANDOM_PLAYER;
  }

  getNextQuestion() {
    this.store.dispatch(new gameplayactions.GetNextQuestion(this.game));
  }

  answerClicked($event: number) {
    Utils.unsubscribe([this.timerSub]);
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
      && Number(this.game.gameOptions.opponentType) === OpponentType.Random) {
      if (this.correctAnswerCount >= 5 || this.game.stats[this.user.userId].round >= 16) {
        this.gameOverContinueClicked();
      }
    } else if (this.questionIndex >= this.game.gameOptions.maxQuestions) {
      this.gameOverContinueClicked();
    }
  }

  continueClicked($event) {
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


  gameOverContinueClicked() {
    this.gameOver = true;
    this.currentQuestion = undefined;
    this.store.dispatch(new gameplayactions.SetGameOver(this.game.gameId));
  }
  afterAnswer(userAnswerId?: number) {

    const correctAnswerId = this.currentQuestion.answers.findIndex(a => a.correct);

    if (userAnswerId === correctAnswerId) {
      this.correctAnswerCount++;
    }

    const seconds = this.MAX_TIME_IN_SECONDS - this.timer;
    const playerQnA: PlayerQnA = {
      playerId: this.user.userId,
      playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
      playerAnswerInSeconds: seconds,
      answerCorrect: (userAnswerId === correctAnswerId),
      questionId: this.currentQuestion.id
    }

    // dispatch action to push player answer
    this.store.dispatch(new gameplayactions.AddPlayerQnA({ 'gameId': this.game.gameId, 'playerQnA': playerQnA }));

    this.questionComponent.disableQuestions(correctAnswerId);
    this.questionAnswered = true;

  }


  ngOnDestroy() {
    Utils.unsubscribe([this.timerSub]);
    Utils.unsubscribe(this.sub);
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
  }
}
