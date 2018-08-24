import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { Game, PlayerQnA, GameOptions, User, Question } from '../../../shared/model';
import { ActionWithPayload, GameActions } from '../actions';
import { GameService } from '../../services'
import { map, switchMap } from 'rxjs/operators';

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
        .pipe(
            map((action: ActionWithPayload<User>) => action.payload),
            switchMap((payload: User) => this.svc.getActiveGames(payload)),
            map((games: Game[]) => this.gameActions.getActiveGamesSuccess(games))
        );
}
