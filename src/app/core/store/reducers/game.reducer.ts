import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { GameActions } from '../actions';
import { Game, Question } from '../../../model';

export const currentGame = (state: any = null, action: Action): Game => {
  switch (action.type) {
    case GameActions.LOAD_GAME_SUCCESS:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};

export const currentGameQuestion = (state: any = null, action: Action): Question => {
  switch (action.type) {
    case GameActions.GET_NEXT_QUESTION_SUCCESS:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
};

export const newGameId = (state: any = "", action: Action): string => {
  switch (action.type) {
    case GameActions.CREATE_NEW_GAME_SUCCESS:
      console.log(action.payload);
      return action.payload;
    case GameActions.RESET_NEW_GAME:
      return "";
    default:
      return state;
  }
};
