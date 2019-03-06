import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Observable } from 'rxjs';
import { User, Game } from '../../../shared/model';

@Injectable()
export class GameActions {
  static GET_ACTIVE_GAMES = 'GET_ACTIVE_GAMES';
  getActiveGames(user: User): ActionWithPayload<User> {
    return {
      type: GameActions.GET_ACTIVE_GAMES,
      payload: user
    };
  }

  static GET_ACTIVE_GAMES_SUCCESS = 'GET_ACTIVE_GAMES_SUCCESS';
  getActiveGamesSuccess(games: Game[]): ActionWithPayload<Game[]> {
    return {
      type: GameActions.GET_ACTIVE_GAMES_SUCCESS,
      payload: games
    };
  }

  static CREATE_NEW_SUCCESS = 'CREATE_NEW_SUCCESS';
  createNewGameSuccess(gameId): ActionWithPayload<string> {
    return {
      type: GameActions.CREATE_NEW_SUCCESS,
      payload: gameId
    };
  }

  static RESET_NEW = 'RESET_NEW';
  resetNewGame(): ActionWithPayload<string> {
    return {
      type: GameActions.RESET_NEW,
      payload: null
    };
  }

  static CREATE_NEW_GAME_ERROR = 'CREATE_NEW_GAME_ERROR';
  createNewGameError(error): ActionWithPayload<string> {
    return {
      type: GameActions.CREATE_NEW_GAME_ERROR,
      payload: error
    };
  }

}
