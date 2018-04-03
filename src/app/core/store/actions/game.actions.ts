import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Observable } from 'rxjs/Observable';
import { User, Game } from '../../../model';

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
  getActiveGamesSuccess(games: [Observable<Game[]>, Observable<Game[]>]): ActionWithPayload<[Observable<Game[]>, Observable<Game[]>]> {
    return {
      type: GameActions.GET_ACTIVE_GAMES_SUCCESS,
      payload: games
    };
  }
}
