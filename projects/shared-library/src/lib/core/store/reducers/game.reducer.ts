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
}
export function newGameId(state: any = "", action: ActionWithPayload<string>): string {
    switch (action.type) {
      case GameActions.CREATE_NEW_SUCCESS:
        return action.payload;
      case GameActions.RESET_NEW:
        return "";
      default:
        return state;
    }
  }

  // Game Create Status
export function gameCreateStatus(state: any = '', action: ActionWithPayload<String>): String {
  switch (action.type) {
    case GameActions.CREATE_NEW_GAME_ERROR:
      return action.payload;
    default:
      return null;
  }
}
