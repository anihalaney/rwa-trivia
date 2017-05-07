import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import '../../../rxjs-extensions';

import { AppStore } from '../../../core/store/app-store';

import { GameQuestionComponent } from '../game-question/game-question.component';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import { Game, GameOptions, GameMode, User, Question, Category }     from '../../../model';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameObs: Observable<Game>;
  game: Game;
  gameQuestionObs: Observable<Question>;
  currentQuestion: Question;
  sub: Subscription[] = [];
  timerSub: Subscription;
  timer: number;
  categoryDictionary: {[key: number]: Category}
  categoryName: string;

  @ViewChild(GameQuestionComponent)
  private questionComponent: GameQuestionComponent;

  constructor(private store: Store<AppStore>, private gameActions: GameActions,
              private route: ActivatedRoute) {
    this.gameObs = store.select(s => s.currentGame).filter(g => g != null);
    this.gameQuestionObs = store.select(s => s.currentGameQuestion).filter(g => g != null);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => this.store.dispatch(this.gameActions.loadGame(params['id'])));
    
    this.store.select(s => s.categoryDictionary).take(1).subscribe(c => {this.categoryDictionary = c} );
    this.sub.push(
      this.gameObs.subscribe(game => {
        this.game = game;
        this.store.dispatch(this.gameActions.getNextQuestion(game.gameId));
    }));

    this.sub.push(
      this.gameQuestionObs.subscribe(question => {
        this.currentQuestion = question;
        this.categoryName = this.categoryDictionary[question.categoryIds[0]].categoryName
        this.timer = 16;

        this.timerSub =
          Observable.timer(1000, 1000).take(this.timer).subscribe(t => {
            this.timer --;
          },
          null,
          () => {
            console.log("Time Expired");
            //disable all buttons
            this.questionComponent.disableQuestions(2);
          })
        
      })
    );
  }

  answerClicked($event) {
    console.log($event);
    Utils.unsubscribe([this.timerSub]);
    //disable all buttons
    this.questionComponent.disableQuestions(2);

    if ($event.correct)
    {
      console.log("CORRECT");
    }
  }

  afterAnswer()
  {

  }

  ngOnDestroy() {
    Utils.unsubscribe([this.timerSub]);
    Utils.unsubscribe(this.sub);
    this.store.dispatch(this.gameActions.resetCurrentGame());
  }
}
