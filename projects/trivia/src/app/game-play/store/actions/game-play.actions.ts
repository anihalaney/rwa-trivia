import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User, GameOptions, Game, PlayerQnA, Question, ReportQuestion } from '../../../../../../shared-library/src/lib/shared/model';

export enum GamePlayActionTypes {
  RESET_NEW = '[GamePlay] ResetNew',
  CREATE_NEW = '[GamePlay] CreateNew',
  CREATE_NEW_SUCCESS = '[GamePlay] CreateNewSuccess',
  LOAD_GAME = '[GamePlay] LoadGame',
  LOAD_SUCCESS = '[GamePlay] LoadSuccess',
  LOAD_GAME_INVITES = '[GamePlay] LoadGameInvites',
  LOAD_GAME_INVITES_SUCCESS = '[GamePlay] LoadGameInvitesSuccess',
  RESET_CURRENT = '[GamePlay] ResetCurrent',
  GET_NEXT_QUESTION = '[GamePlay] GetNextQuestion',
  GET_NEXT_QUESTION_SUCCESS = '[GamePlay] GetNextQuestionSuccess',
  ADD_PLAYER_QNA = '[GamePlay] AddPlayerQnA',
  ADD_PLAYER_QNA_SUCCESS = '[GamePlay] AddPlayerQnASuccess',
  SET_GAME_OVER = '[GamePlay] SetGameOver',
  REJECT_GAME_INVITATION = '[GamePlay] RejectGameInvitation',
  RESET_CURRENT_QUESTION = '[GamePlay] ResetCurrentQuestion',
  UPDATE_GAME_SUCCESS = '[GamePlay] UpdateGameSuccess',
  GET_USERS_ANSWERED_QUESTION = '[GamePlay] GetUsersAnsweredQuestion',
  GET_USERS_ANSWERED_QUESTION_SUCCESS = '[GamePlay] GetUsersAnsweredQuestionSuccess',
  SAVE_REPORT_QUESTION = '[GamePlay] SaveReportQuestion',
  SAVE_REPORT_QUESTION_SUCCESS = '[GamePlay] SaveReportQuestionSuccess',
  UPDATE_GAME_ROUND = '[GamePlay] UpdateGameRound'
}

export class ResetNewGame implements Action {
  readonly type = GamePlayActionTypes.RESET_NEW;
  payload = null;
}

export class CreateNewGame implements Action {
  readonly type = GamePlayActionTypes.CREATE_NEW;
  constructor(public payload: { gameOptions: GameOptions, user: User }) { }
}

export class CreateNewGameSuccess implements Action {
  readonly type = GamePlayActionTypes.CREATE_NEW_SUCCESS;
  constructor(public payload: string) { } //gameId
}


export class LoadGame implements Action {
  readonly type = GamePlayActionTypes.LOAD_GAME;
  constructor(public payload: string) { } //game
}

export class LoadGameSuccess implements Action {
  readonly type = GamePlayActionTypes.LOAD_SUCCESS;
  constructor(public payload: Game) { } //game
}

export class LoadGameInvites implements Action {
  readonly type = GamePlayActionTypes.LOAD_GAME_INVITES;
  constructor(public payload: string) { } //game
}

export class LoadGameInvitesSuccess implements Action {
  readonly type = GamePlayActionTypes.LOAD_GAME_INVITES_SUCCESS;
  constructor(public payload: Game[]) { } //game
}

export class ResetCurrentGame implements Action {
  readonly type = GamePlayActionTypes.RESET_CURRENT;
  payload = null;
}

export class GetNextQuestion implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION;
  constructor(public payload: Game) { } //game - change in type for reducer
}

export class GetNextQuestionSuccess implements Action {
  readonly type = GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS;
  constructor(public payload: Question) { } //question
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
  constructor(public payload: string) { }
}

export class RejectGameInvitation implements Action {
  readonly type = GamePlayActionTypes.REJECT_GAME_INVITATION;
  constructor(public payload: string) { }
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
  constructor(public payload: { userId: string, game: Game }) { } //userId
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



export type GamePlayActions
  = ResetNewGame
  | CreateNewGame
  | CreateNewGameSuccess
  | LoadGameSuccess
  | LoadGameInvites
  | LoadGameInvitesSuccess
  | ResetCurrentGame
  | GetNextQuestion
  | GetNextQuestionSuccess
  | AddPlayerQnA
  | AddPlayerQnASuccess
  | SetGameOver
  | RejectGameInvitation
  | ResetCurrentQuestion
  | UpdateGameSuccess
  | GetUsersAnsweredQuestion
  | GetUsersAnsweredQuestionSuccess
  | SaveReportQuestion
  | SaveReportQuestionSuccess
  | UpdateGameRound;
