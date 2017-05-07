import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Action} from '@ngrx/store';

import {AppStore} from '../app-store';
import {Game, GameOptions, User, Question} from '../../../model';
import {GameActions} from '../actions';
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
        .map((action: Action) => action.payload)
        .switchMap((payload: {gameOptions: GameOptions, user: User}) => this.svc.createNewGame(payload.gameOptions, payload.user))
        .map((gameId: string) => this.gameActions.createNewGameSuccess(gameId));
        //.filter(() => false);

    @Effect() 
    loadGame$ = this.actions$
        .ofType(GameActions.LOAD_GAME)
        .map((action: Action) => action.payload)
        .switchMap((payload: string) => this.svc.getGame(payload))
        .map((game: Game) => this.gameActions.loadGameSuccess(game));

    @Effect() 
    loadNextQuestion$ = this.actions$
        .ofType(GameActions.GET_NEXT_QUESTION)
        .map((action: Action) => action.payload)
        .switchMap((payload: string) => this.svc.getNextQuestion(payload))
        .map((question: Question[]) => this.gameActions.getNextQuestionSuccess(question[0]));

    @Effect() 
    getActiveGames$ = this.actions$
        .ofType(GameActions.GET_ACTIVE_GAMES)
        .map((action: Action) => action.payload)
        .switchMap((payload: User) => this.svc.getActiveGames(payload))
        .map((games: string[]) => this.gameActions.getActiveGamesSuccess(games));
}
