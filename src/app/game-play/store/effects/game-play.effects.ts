import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, filter } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { Observable } from 'rxjs/Rx';
import { Game, PlayerQnA, GameOptions, User, Question, RouterStateUrl } from '../../../model';
import { GamePlayActions, GamePlayActionTypes } from '../actions';
import * as gameplayactions from '../actions/game-play.actions';
import { GameService } from '../../../core/services';

@Injectable()
export class GamePlayEffects {
  constructor(
    private actions$: Actions,
    private svc: GameService
  ) { }

  @Effect()
  startNewGame$ = this.actions$
    .ofType(GamePlayActionTypes.CREATE_NEW)
    .pipe(
    switchMap((action: gameplayactions.CreateNewGame) =>
      this.svc.createNewGame(action.payload.gameOptions, action.payload.user).pipe(
        map((gameId: string) => new gameplayactions.CreateNewGameSuccess(gameId))
        //catchError(error => new)
      )
    )
    );

  //load from router
  @Effect()
  // handle location update
  loadGame$ = this.actions$
    .ofType(GamePlayActionTypes.LOAD_GAME)
    .pipe(
    switchMap((action: gameplayactions.LoadGame) =>
      this.svc.getGame(action.payload.gameId).pipe(
        map((game: Game) => new gameplayactions.LoadGameSuccess(game))
      )
    )
    );

  //load from router
  @Effect()
  // handle location update
  loadGame2$ = this.actions$
    .ofType('ROUTER_NAVIGATION')
    .map((action: any): RouterStateUrl => action.payload.routerState)
    .filter((routerState: RouterStateUrl) =>
      routerState.url.toLowerCase().startsWith('/game-play/') &&
      routerState.params.gameid
    )
    .pipe(
    switchMap((routerState: RouterStateUrl) =>
      this.svc.getGame(routerState.params.gameid).pipe(
        map((game: Game) => new gameplayactions.LoadGameSuccess(game))
      )
    )
    );

  @Effect()
  loadNextQuestion$ = this.actions$
    .ofType(GamePlayActionTypes.GET_NEXT_QUESTION)
    .pipe(
    switchMap((action: gameplayactions.GetNextQuestion) =>
      this.svc.getNextQuestion(action.payload).pipe(
        map((question: Question) => new gameplayactions.GetNextQuestionSuccess(question))
      )
    )
    );

  @Effect()
  addPlayerQnA$ = this.actions$
    .ofType(GamePlayActionTypes.ADD_PLAYER_QNA)
    .pipe(
    switchMap((action: gameplayactions.AddPlayerQnA) =>
      this.svc.addPlayerQnAToGame(action.payload.game, action.payload.playerQnA).pipe(
        map((msg: any) => new gameplayactions.UpdateGameSuccess())
      )
    ));

  @Effect()
  setGameOver$ = this.actions$
    .ofType(GamePlayActionTypes.SET_GAME_OVER)
    .pipe(
    switchMap((action: gameplayactions.SetGameOver) =>
      this.svc.setGameOver(action.payload.game, action.payload.user).pipe(
        map((msg: any) => new gameplayactions.UpdateGameSuccess())
      )
    ));

}
