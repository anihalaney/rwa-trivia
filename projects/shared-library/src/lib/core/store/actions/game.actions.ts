import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Observable } from 'rxjs';
import { User, Game, Question } from '../../../shared/model';

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


  static GET_USER_REACTION = '[GamePlay] GetUserReaction';
  GetUserReaction(payload: {questionId: string, userId: string}): ActionWithPayload<{questionId: string, userId: string}> {
    return {
      type: GameActions.GET_USER_REACTION,
      payload: payload
    };
  }

  static GET_USER_REACTION_SUCCESS = '[GamePlay] GetUserReactionSuccess';
  GetUserReactionSuccess(status: {status: string}): ActionWithPayload<{status: string}> {
    return {
      type: GameActions.GET_USER_REACTION_SUCCESS,
      payload: status
    };
  }

  static GET_QUESTION_SUCCESS = '[GamePlay] GetQuestionSuccess';
  GetQuestionSuccess(question: Question): ActionWithPayload<Question> {
    return {
      type: GameActions.GET_QUESTION_SUCCESS,
      payload: question
    };
  }


  static GET_QUESTION = '[GamePlay] GetQuestion';
  GetQuestion(questionId: string): ActionWithPayload<string> {
    return {
      type: GameActions.GET_QUESTION,
      payload: questionId
    };
  }

  static USER_REACTION = '[GamePlay] UserReaction';
  UserReaction( payload: { questionId: string, userId: string, status: string } ):
  ActionWithPayload<{ questionId: string, userId: string, status: string }> {
    return {
      type: GameActions.USER_REACTION,
      payload: payload
    };
  }

  static UPADTE_USER_REACTION_SUCCESS = '[GamePlay] UpdateUserReactionSuccess';
  UpdateUserReactionSuccess(): ActionWithPayload<null> {
    return {
      type: GameActions.UPADTE_USER_REACTION_SUCCESS,
      payload: null
    };
  }

}
