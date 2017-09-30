import { Component, Inject, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import { AppStore } from '../../../core/store/app-store';

import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import { Game, GameOptions, GameMode, PlayerQnA,
         User, Question, Category } from '../../../model';

@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss']
})
export class GameDialogComponent implements OnInit, OnDestroy {
  private _gameId: string;
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
  categoryDictionary: {[key: number]: Category}
  categoryName: string;

  continueNext: boolean = false;
  gameOver: boolean = false;

  MAX_TIME_IN_SECONDS: number = 16;

  @ViewChild(GameQuestionComponent)
  private questionComponent: GameQuestionComponent;

  constructor(private store: Store<AppStore>, private gameActions: GameActions,
    @Inject(MD_DIALOG_DATA) public data: any) {
    
    this._gameId = data.gameId;
    this.user = data.user;

    this.questionIndex = 0;
    this.correctAnswerCount = 0;
    this.gameObs = store.select(s => s.currentGame).filter(g => g != null);
    this.gameQuestionObs = store.select(s => s.currentGameQuestion);
  }

  ngOnInit() {
    //this.store.take(1).subscribe(s => this.user = s.user); //logged in user

    this.store.dispatch(this.gameActions.loadGame({"gameId": this._gameId, "user": this.user}));

    this.store.select(s => s.categoryDictionary).take(1).subscribe(c => {this.categoryDictionary = c} );
    this.sub.push(
      this.gameObs.subscribe(game => {
        this.game = game;
        this.questionIndex = this.game.playerQnAs.length;
        this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect).length;
        if (!this.currentQuestion)
          this.getNextQuestion();
    }));

    this.sub.push(
      this.gameQuestionObs.subscribe(question => {
        if (!question)
        {
          this.currentQuestion = null;
          return;
        }
        this.currentQuestion = question;
        this.questionIndex ++;
        this.categoryName = this.categoryDictionary[question.categoryIds[0]].categoryName
        this.timer = this.MAX_TIME_IN_SECONDS;

        this.timerSub =
          Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
            this.timer --;
          },
          null,
          () => {
            console.log("Time Expired");
            //disable all buttons
            //this.afterAnswer();
          });
        
      })
    );
  }

  getNextQuestion()
  {
    this.store.dispatch(this.gameActions.getNextQuestion({"game": this.game}));
  }

  answerClicked($event: number) {
    //console.log($event);
    Utils.unsubscribe([this.timerSub]);
    //disable all buttons
    this.afterAnswer($event);
  }
  okClick($event){
    if (this.questionIndex >= this.game.gameOptions.maxQuestions)
      this.gameOver = true;
    else
      this.continueNext = true;
  }

  continueClicked($event) {
    this.store.dispatch(this.gameActions.resetCurrentQuestion());
    this.continueNext = false;
    if (this.questionIndex >= this.game.gameOptions.maxQuestions)
    {
      //game over
      this.gameOver = true;
      return;
    }
    this.getNextQuestion();
  }

  viewQuestionClicked($event) 
  {
    if (this.continueNext)
      this.continueNext = false;
    if (this.gameOver)
      this.gameOver = false;
  }
  gameOverContinueClicked() {
    //this.router.navigate(['/']);
  }
  afterAnswer(userAnswerId?: number)
  {
    let correctAnswerId = this.currentQuestion.answers.findIndex(a => a.correct);
    //console.log(correctAnswerId);
    if (userAnswerId === correctAnswerId)
      this.correctAnswerCount ++;
    let seconds = this.MAX_TIME_IN_SECONDS - this.timer;
    let playerQnA: PlayerQnA = {
            playerId: this.user.userId,
            playerAnswerId: isNaN(userAnswerId) ? null : userAnswerId.toString(),
            playerAnswerInSeconds: seconds,
            answerCorrect: (userAnswerId === correctAnswerId),
            questionId: this.currentQuestion.id
          }
    //console.log(playerQnA);
    
    //dispatch action to push player answer
    this.store.dispatch(this.gameActions.addPlayerQnA({"game": this.game, "playerQnA": playerQnA}));
    
    if (this.questionIndex >= this.game.gameOptions.maxQuestions)
    {
      //game over
      this.store.dispatch(this.gameActions.setGameOver({"game": this.game, "user": this.user}));
    }

    this.questionComponent.disableQuestions(correctAnswerId);
    Observable.timer(1000).take(1).subscribe(t => {
      this.continueNext = true;
    });
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.timerSub]);
    Utils.unsubscribe(this.sub);
    this.store.dispatch(this.gameActions.resetCurrentGame());
  }
}
