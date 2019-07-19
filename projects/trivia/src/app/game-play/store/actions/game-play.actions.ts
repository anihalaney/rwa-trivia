import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User, GameOptions, Game, PlayerQnA, Question, ReportQuestion } from 'shared-library/shared/model';

export enum GamePlayActionTypes {
  CREATE_NEW = '[GamePlay] CreateNew',
  LOAD_GAME = '[GamePlay] LoadGame',
  LOAD_SUCCESS = '[GamePlay] LoadSuccess',
  RESET_CURRENT = '[GamePlay] ResetCurrent',
  GET_NEXT_QUESTION = '[GamePlay] GetNextQuestion',
  GET_NEXT_QUESTION_SUCCESS = '[GamePlay] GetNextQuestionSuccess',
  ADD_PLAYER_QNA = '[GamePlay] AddPlayerQnA',
  ADD_PLAYER_QNA_SUCCESS = '[GamePlay] AddPlayerQnASuccess',
  SET_GAME_OVER = '[GamePlay] SetGameOver',
  RESET_CURRENT_QUESTION = '[GamePlay] ResetCurrentQuestion',
  UPDATE_GAME_SUCCESS = '[GamePlay] UpdateGameSuccess',
  GET_USERS_ANSWERED_QUESTION = '[GamePlay] GetUsersAnsweredQuestion',
  GET_USERS_ANSWERED_QUESTION_SUCCESS = '[GamePlay] GetUsersAnsweredQuestionSuccess',
  SAVE_REPORT_QUESTION = '[GamePlay] SaveReportQuestion',
  SAVE_REPORT_QUESTION_SUCCESS = '[GamePlay] SaveReportQuestionSuccess',
  UPDATE_GAME_ROUND = '[GamePlay] UpdateGameRound',
  USER_REACTION = '[GamePlay] UserReaction',
  UPADTE_USER_REACTION_SUCCESS = '[GamePlay] UpdateUserReactionSuccess',
  GET_USER_REACTION = '[GamePlay] GetUserReaction',
  GET_USER_REACTION_SUCCESS = '[GamePlay] GetUserReactionSuccess'
}

export class CreateNewGame implements Action {
  readonly type = GamePlayActionTypes.CREATE_NEW;
  constructor(public payload: { gameOptions: GameOptions, user: User }) { }
}

export class LoadGame implements Action {
  readonly type = GamePlayActionTypes.LOAD_GAME;
  constructor(public payload: string) { } // game
}

export class LoadGameSuccess implements Action {
  readonly type = GamePlayActionTypes.LOAD_SUCCESS;
  constructor(public payload: Game) { } // game
}

export class ResetCurrentGame implements Action {
  readonly type = GamePlayActionTypes.RESET_CURRENT;
  payload = null;
}

export class GetNextQuestion implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION;
  constructor(public payload: Game) { } // game - change in type for reducer
}

export class GetNextQuestionSuccess implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS;
  constructor(public payload: Question) { } // question
}


export class GetUserReaction implements Action {
  readonly type = GamePlayActionTypes.GET_USER_REACTION;
  constructor(public payload: {questionId: string, userId: string}) { } // get User Reaction
}

export class GetUserReactionSuccess implements Action {
  readonly type = GamePlayActionTypes.GET_USER_REACTION_SUCCESS;
  constructor(public payload: {status: string}) { } // question
}

export class AddPlayerQnA implements Action {
  readonly type = GamePlayActionTypes.ADD_PLAYER_QNA;
  constructor(public payload: { gameId: string, playerQnA: PlayerQnA }) { }
}

export class AddPlayerQnASuccess implements Action {
  readonly type = GamePlayActionTypes.ADD_PLAYER_QNA_SUCCESS;
  payload = null;
}

export class SetGameOver implements Action {
  readonly type = GamePlayActionTypes.SET_GAME_OVER;
  constructor(public payload: { playedGame: Game, userId: string, otherUserId: string }) { }
}

export class ResetCurrentQuestion implements Action {
  readonly type = GamePlayActionTypes.RESET_CURRENT_QUESTION;
  payload = null;
}

export class UpdateGameSuccess implements Action {
  readonly type = GamePlayActionTypes.UPDATE_GAME_SUCCESS;
  payload = null;
}

export class GetUsersAnsweredQuestion implements Action {
  readonly type = GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION;
  constructor(public payload: { userId: string, game: Game }) { } // userId
}
export class GetUsersAnsweredQuestionSuccess implements Action {
  readonly type = GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION_SUCCESS;
  constructor(public payload: any) { }
}
export class SaveReportQuestion implements Action {
  readonly type = GamePlayActionTypes.SAVE_REPORT_QUESTION;
  constructor(public payload: { reportQuestion: ReportQuestion, game: Game }) { }
}
export class SaveReportQuestionSuccess implements Action {
  readonly type = GamePlayActionTypes.SAVE_REPORT_QUESTION_SUCCESS;
  payload = null;
}

export class UpdateGameRound implements Action {
  readonly type = GamePlayActionTypes.UPDATE_GAME_ROUND;
  constructor(public payload: string) { }
}

export class UserReaction implements Action {
  readonly type = GamePlayActionTypes.USER_REACTION;
  constructor(public payload: { questionId: string, userId: string, status: string }) { console.log('===>'); }
}

export class UpdateUserReactionSuccess implements Action {
  readonly type = GamePlayActionTypes.UPADTE_USER_REACTION_SUCCESS;
  constructor(public payload: any) { }
}

export type GamePlayActions
  = CreateNewGame
  | LoadGameSuccess
  | ResetCurrentGame
  | GetNextQuestion
  | GetNextQuestionSuccess
  | AddPlayerQnA
  | AddPlayerQnASuccess
  | SetGameOver
  | ResetCurrentQuestion
  | UpdateGameSuccess
  | GetUsersAnsweredQuestion
  | GetUsersAnsweredQuestionSuccess
  | SaveReportQuestion
  | SaveReportQuestionSuccess
  | UpdateGameRound
  | UserReaction
  | UpdateUserReactionSuccess
  | GetUserReaction
  | GetUserReactionSuccess;
