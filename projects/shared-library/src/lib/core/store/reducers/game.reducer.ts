import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ActionWithPayload, GameActions, UserActions } from '../actions';
import { Game } from '../../../shared/model';

export function activeGames(state: any = [], action: ActionWithPayload<Game[]>): Game[] {
  switch (action.type) {
    case GameActions.GET_ACTIVE_GAMES_SUCCESS:
      return action.payload;
    case UserActions.LOGOFF:
      return [];
    default:
      return state;
  }
};
