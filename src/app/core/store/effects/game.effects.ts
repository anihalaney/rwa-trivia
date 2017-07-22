import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Action} from '@ngrx/store';

import {AppStore} from '../app-store';
import {Game, PlayerQnA, GameOptions, User, Question} from '../../../model';
import {ActionWithPayload, GameActions} from '../actions';
import {GameService} from '../../services'

@Injectable()
export class GameEffects {
    constructor (
        private actions$: Actions,
        private gameActions: GameActions,
        private svc: GameService
    ) {}

    @Effect() 
    startNewGame$ = this.actions$
        .ofType(GameActions.CREATE_NEW_GAME)
        .map((action: ActionWithPayload<{gameOptions: GameOptions, user: User}>) => action.payload)
        .switchMap((payload: {gameOptions: GameOptions, user: User}) => this.svc.createNewGame(payload.gameOptions, payload.user))
        .map((gameId: string) => this.gameActions.createNewGameSuccess(gameId));
        //.filter(() => false);

    @Effect() 
    loadGame$ = this.actions$
        .ofType(GameActions.LOAD_GAME)
        .map((action: ActionWithPayload<{gameId: string, user: User}>) => action.payload)
        .switchMap((payload: {gameId: string, user: User}) => this.svc.getGame(payload.gameId, payload.user))
        .map((game: Game) => this.gameActions.loadGameSuccess(game));

    @Effect() 
    loadNextQuestion$ = this.actions$
        .ofType(GameActions.GET_NEXT_QUESTION)
        .map((action: ActionWithPayload<{game: Game, user: User}>) => action.payload)
        .switchMap((payload: {game: Game, user: User}) => this.svc.getNextQuestion(payload.game, payload.user))
        .map((question: Question) => this.gameActions.getNextQuestionSuccess(question));

    @Effect() 
    addPlayerQnA$ = this.actions$
        .ofType(GameActions.ADD_PLAYER_QNA)
        .map((action: ActionWithPayload<{game: Game, playerQnA: PlayerQnA}>) => action.payload)
        .do((payload: {game: Game, playerQnA: PlayerQnA}) => this.svc.addPlayerQnAToGame(payload.game, payload.playerQnA))
        .filter(() => false);

    @Effect() 
    setGameOver$ = this.actions$
        .ofType(GameActions.SET_GAME_OVER)
        .map((action: ActionWithPayload<{game: Game, user: User}>) => action.payload)
        .do((payload: {game: Game, user: User}) => this.svc.setGameOver(payload.game, payload.user))
        .filter(() => false);

    @Effect() 
    getActiveGames$ = this.actions$
        .ofType(GameActions.GET_ACTIVE_GAMES)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((payload: User) => this.svc.getActiveGames(payload))
        .map((games: string[]) => this.gameActions.getActiveGamesSuccess(games));
}
