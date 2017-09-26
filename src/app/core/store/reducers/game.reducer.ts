import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { ActionWithPayload, GameActions, UserActions } from '../actions';
import { Game, Question } from '../../../model';

export function currentGame (state: any = null, action: ActionWithPayload<Game>): Game {
  switch (action.type) {
    case GameActions.LOAD_GAME_SUCCESS:
      //console.log(action.payload);
      return action.payload;
    case UserActions.LOGOFF:
    case GameActions.RESET_CURRENT_GAME:
      return null;
    default:
      return state;
  }
};

export function currentGameQuestion (state: any = null, action: ActionWithPayload<Question>): Question {
  switch (action.type) {
    case GameActions.GET_NEXT_QUESTION_SUCCESS:
      //console.log(action.payload);
      return action.payload;
    case UserActions.LOGOFF:
    case GameActions.RESET_CURRENT_GAME:
    case GameActions.RESET_CURRENT_QUESTION:
      return null;
    default:
      return state;
  }
};

export function newGameId (state: any = "", action: ActionWithPayload<string>): string {
  switch (action.type) {
    case GameActions.CREATE_NEW_GAME_SUCCESS:
      //console.log(action.payload);
      return action.payload;
    case UserActions.LOGOFF:
    case GameActions.RESET_NEW_GAME:
    case GameActions.RESET_CURRENT_GAME:
      return "";
    default:
      return state;
  }
};

export function activeGames (state: any = [], action: ActionWithPayload<string[]>): string[] {
  switch (action.type) {
    case GameActions.GET_ACTIVE_GAMES_SUCCESS:
      return action.payload;
    case UserActions.LOGOFF:
      return [];
    default:
      return state;
  }
};
