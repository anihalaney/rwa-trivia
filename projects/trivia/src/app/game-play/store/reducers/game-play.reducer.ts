import { GamePlayActions, GamePlayActionTypes } from '../actions';
import { UserActions } from '../../../../../../shared-library/src/lib/core/store';
import { Game, Question, ReportQuestion } from '../../../../../../shared-library/src/lib/shared/model';

export function currentGame(state: any = null, action: GamePlayActions): Game {
  switch (action.type) {
    case GamePlayActionTypes.LOAD_SUCCESS:
      return action.payload;
    case UserActions.LOGOFF:
      return null;
    case GamePlayActionTypes.RESET_CURRENT:
      return null;
    default:
      return state;
  }
};

export function currentGameQuestion(state: any = null, action: GamePlayActions): Question {
  switch (action.type) {
    case GamePlayActionTypes.GET_NEXT_QUESTION_SUCCESS:
      return action.payload;
    case UserActions.LOGOFF:
      return null;
    case GamePlayActionTypes.RESET_CURRENT_QUESTION:
      return null;
    default:
      return state;
  }
};

export function newGameId(state: any = "", action: GamePlayActions): string {
  switch (action.type) {
    case GamePlayActionTypes.CREATE_NEW_SUCCESS:
      return action.payload;
    case GamePlayActionTypes.RESET_NEW:
      return "";
    default:
      return state;
  }
};

export function updateGame(state: any = null, action: GamePlayActions): Game {
  switch (action.type) {
    case GamePlayActionTypes.UPDATE_GAME_SUCCESS:
      return null;
    default:
      return null;
  }
};

export function gameInvites(state: any = [], action: GamePlayActions): Game[] {
  switch (action.type) {
    case GamePlayActionTypes.LOAD_GAME_INVITES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function userAnsweredQuestion(state: any = null, action: GamePlayActions): any {
  switch (action.type) {
    case GamePlayActionTypes.GET_USERS_ANSWERED_QUESTION_SUCCESS:
      return action.payload;
    default:
      return null;
  }
};

export function saveReportQuestion(state: any = null, action: GamePlayActions): string {
  switch (action.type) {
    case GamePlayActionTypes.SAVE_REPORT_QUESTION_SUCCESS:
      return 'SUCCESS';
  }
};

