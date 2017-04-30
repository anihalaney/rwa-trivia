import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import { User, GameOptions, Game, Question } from '../../../model';

@Injectable()
export class GameActions {

  static RESET_NEW_GAME = 'RESET_NEW_GAME';
  resetNewGame(): Action {
    return {
      type: GameActions.RESET_NEW_GAME,
      payload: ""
    };
  }

  static CREATE_NEW_GAME = 'CREATE_NEW_GAME';
  createNewGame(payload: {gameOptions: GameOptions, user: User}): Action {
    return {
      type: GameActions.CREATE_NEW_GAME,
      payload: payload
    };
  }

  static CREATE_NEW_GAME_SUCCESS = 'CREATE_NEW_GAME_SUCCESS';
  createNewGameSuccess(gameId: string): Action {
    return {
      type: GameActions.CREATE_NEW_GAME_SUCCESS,
      payload: gameId
    };
  }

  static LOAD_GAME = 'LOAD_GAME';
  loadGame(gameId: string): Action {
    return {
      type: GameActions.LOAD_GAME,
      payload: gameId
    };
  }

  static LOAD_GAME_SUCCESS = 'LOAD_GAME_SUCCESS';
  loadGameSuccess(game: Game): Action {
    return {
      type: GameActions.LOAD_GAME_SUCCESS,
      payload: game
    };
  }

  static GET_NEXT_QUESTION = 'GET_NEXT_QUESTION';
  getNextQuestion(gameId: string): Action {
    return {
      type: GameActions.GET_NEXT_QUESTION,
      payload: gameId
    };
  }

  static GET_NEXT_QUESTION_SUCCESS = 'GET_NEXT_QUESTION_SUCCESS';
  getNextQuestionSuccess(question: Question): Action {
    return {
      type: GameActions.GET_NEXT_QUESTION_SUCCESS,
      payload: question
    };
  }

}