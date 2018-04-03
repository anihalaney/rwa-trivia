import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { ActionWithPayload, GameActions, UserActions } from '../actions';
import { Game } from '../../../model';

export function activeGames(state: any = [], action: ActionWithPayload<[Observable<Game[]>, Observable<Game[]>]>):
  [Observable<Game[]>, Observable<Game[]>] {
  switch (action.type) {
    case GameActions.GET_ACTIVE_GAMES_SUCCESS:
      return action.payload;
    // case UserActions.LOGOFF:
    //   return [];
    default:
      return state;
  }
};
