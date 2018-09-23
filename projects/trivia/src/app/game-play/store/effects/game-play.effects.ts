import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map, catchError, filter, mergeMap } from 'rxjs/operators';

import { GameService } from '../../../../../../shared-library/src/lib/core/services';
import { Game, PlayerQnA, GameOptions, User, Question, RouterStateUrl } from '../../../../../../shared-library/src/lib/shared/model';
import { GamePlayActions, GamePlayActionTypes } from '../actions';
import * as gameplayactions from '../actions/game-play.actions';


@Injectable()
export class GamePlayEffects {


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


  @Effect()
  // handle location update
  loadGame$ = this.actions$
    .ofType(GamePlayActionTypes.LOAD_GAME)
    .pipe(
      switchMap((action: gameplayactions.LoadGame) =>
        this.svc.getGame(action.payload).pipe(
          map((game: Game) => new gameplayactions.LoadGameSuccess(game))
        )
      )
    );

  //load invited games
  @Effect()
  // handle location update
  loadGameInvites$ = this.actions$
    .ofType(GamePlayActionTypes.LOAD_GAME_INVITES)
    .pipe(
      switchMap((action: gameplayactions.LoadGameInvites) =>
        this.svc.getGameInvites(action.payload).pipe(
          map((games: Game[]) => new gameplayactions.LoadGameInvitesSuccess(games))
        )
      )
    );

  //load from router
  @Effect()
  // handle location update
  loadGame2$ = this.actions$
    .ofType('ROUTER_NAVIGATION')
    .pipe(
      map((action: any): RouterStateUrl => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.toLowerCase().startsWith('/game-play/') &&
        routerState.params.gameid
      ))
    .pipe(
      switchMap((routerState: RouterStateUrl) =>
        this.svc.getGame(routerState.params.gameid).pipe(
          map((game: Game) => new gameplayactions.LoadGameSuccess(game))
        )
      ));

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
        this.svc.addPlayerQnAToGame(action.payload.gameId, action.payload.playerQnA).pipe(
          map((msg: any) => new gameplayactions.UpdateGameSuccess())
        )
      ));

  @Effect()
  setGameOver$ = this.actions$
    .ofType(GamePlayActionTypes.SET_GAME_OVER)
    .pipe(
      switchMap((action: gameplayactions.SetGameOver) =>
        this.svc.setGameOver(action.payload).pipe(
          map((msg: any) => new gameplayactions.UpdateGameSuccess())
        )
      ));

  @Effect()
  rejectGameInvitation$ = this.actions$
    .ofType(GamePlayActionTypes.REJECT_GAME_INVITATION)
    .pipe(
      switchMap((action: gameplayactions.RejectGameInvitation) =>
        this.svc.rejectGameInvitation(action.payload).pipe(
          map((msg: any) => new gameplayactions.UpdateGameSuccess())
        )
      ));

  @Effect()
  getUserAnsweredQuestions$ = this.actions$
    .ofType(GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION)
    .pipe(
      switchMap((action: gameplayactions.GetUsersAnsweredQuestion) =>
        this.svc.getUsersAnsweredQuestion(action.payload.userId, action.payload.game).pipe(
          map((questionArray: any) => new gameplayactions.GetUsersAnsweredQuestionSuccess(questionArray))
        )
      ));
  @Effect()
  reportQuestion$ = this.actions$
    .ofType(GamePlayActionTypes.SAVE_REPORT_QUESTION)
    .pipe(
      switchMap((action: gameplayactions.SaveReportQuestion) =>
        this.svc.saveReportQuestion(action.payload.reportQuestion, action.payload.game)
          .pipe(mergeMap((status: any) => this.svc.updateGame(action.payload.reportQuestion, action.payload.game)))
          .pipe(map((report: any) => new gameplayactions.SaveReportQuestionSuccess())))
    );

  @Effect()
  UpdateGameRound$ = this.actions$
    .ofType(GamePlayActionTypes.UPDATE_GAME_ROUND)
    .pipe(
      switchMap((action: gameplayactions.UpdateGameRound) =>
        this.svc.updateGameRound(action.payload).pipe(
          map((msg: any) => new gameplayactions.UpdateGameSuccess())
        )
      ));

  constructor(
    private actions$: Actions,
    private svc: GameService
  ) { }

}
