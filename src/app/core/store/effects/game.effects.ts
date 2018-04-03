import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Game, PlayerQnA, GameOptions, User, Question } from '../../../model';
import { ActionWithPayload, GameActions } from '../actions';
import { GameService } from '../../services'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GameEffects {
    constructor(
        private actions$: Actions,
        private gameActions: GameActions,
        private svc: GameService
    ) { }
    @Effect()
    getActiveGames$ = this.actions$
        .ofType(GameActions.GET_ACTIVE_GAMES)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((payload: User) => this.svc.getActiveGames(payload))
        .map((games: [Observable<Game[]>, Observable<Game[]>]) => this.gameActions.getActiveGamesSuccess(games));
}
