import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import { User, GameOptions, Game, PlayerQnA, Question } from '../../../model';

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
  loadGame(payload: {gameId: string, user: User}): Action {
    return {
      type: GameActions.LOAD_GAME,
      payload: payload
    };
  }

  static LOAD_GAME_SUCCESS = 'LOAD_GAME_SUCCESS';
  loadGameSuccess(game: Game): Action {
    return {
      type: GameActions.LOAD_GAME_SUCCESS,
      payload: game
    };
  }

  static RESET_CURRENT_GAME = 'RESET_CURRENT_GAME';
  resetCurrentGame(): Action {
    return {
      type: GameActions.RESET_CURRENT_GAME,
      payload: null
    };
  }

  static GET_NEXT_QUESTION = 'GET_NEXT_QUESTION';
  getNextQuestion(payload: {game: Game, user: User}): Action {
    return {
      type: GameActions.GET_NEXT_QUESTION,
      payload: payload
    };
  }

  static GET_NEXT_QUESTION_SUCCESS = 'GET_NEXT_QUESTION_SUCCESS';
  getNextQuestionSuccess(question: Question): Action {
    return {
      type: GameActions.GET_NEXT_QUESTION_SUCCESS,
      payload: question
    };
  }

  static ADD_PLAYER_QNA = 'ADD_PLAYER_QNA';
  addPlayerQnA(payload: {game: Game, playerQnA: PlayerQnA}): Action {
    return {
      type: GameActions.ADD_PLAYER_QNA,
      payload: payload
    };
  }

  static ADD_PLAYER_QNA_SUCCESS = 'ADD_PLAYER_QNA_SUCCESS';
  addPlayerQnASuccess(): Action {
    return {
      type: GameActions.ADD_PLAYER_QNA_SUCCESS,
      payload: null
    };
  }

  static SET_GAME_OVER = 'SET_GAME_OVER';
  setGameOver(payload: {game: Game, user: User}): Action {
    return {
      type: GameActions.SET_GAME_OVER,
      payload: payload
    };
  }

  static RESET_CURRENT_QUESTION = 'RESET_CURRENT_QUESTION';
  resetCurrentQuestion(): Action {
    return {
      type: GameActions.RESET_CURRENT_QUESTION,
      payload: null
    };
  }

  static GET_ACTIVE_GAMES = 'GET_ACTIVE_GAMES';
  getActiveGames(user: User): Action {
    return {
      type: GameActions.GET_ACTIVE_GAMES,
      payload: user
    };
  }

  static GET_ACTIVE_GAMES_SUCCESS = 'GET_ACTIVE_GAMES_SUCCESS';
  getActiveGamesSuccess(games: string[]): Action {
    return {
      type: GameActions.GET_ACTIVE_GAMES_SUCCESS,
      payload: games
    };
  }
}