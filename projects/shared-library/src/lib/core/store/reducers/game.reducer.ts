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


export function updateUserReactionStatus(state: any = null, action: any): any {
  switch (action.type) {
    case GameActions.UPADTE_USER_REACTION_SUCCESS:
      return action.payload;
  }
}


export function getUserReactionStatus(state: any = null, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case GameActions.GET_USER_REACTION_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}



export function getQuestionSuccess(state: any = null, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case GameActions.GET_QUESTION_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function updateQuestionStatSuccess(state: any = null, action: any): any {
  switch (action.type) {
    case GameActions.UPDATE_QUESTION_STAT_SUCCESS:
      return action.payload;
  }
}

