import { ActionWithPayload, QuestionActions } from '../actions';


export function questionOfTheDay(state: any = null, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS:
      return action.payload;
    case QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR:
      return action.payload;
    default:
      return state;
  }
}

export function questionSaveStatus(state: any = 'NONE', action: ActionWithPayload<string>): string {
  switch (action.type) {
    case QuestionActions.ADD_QUESTION_SUCCESS:
      return 'SUCCESS';
    case QuestionActions.RESET_QUESTION_SUCCESS:
      return 'NONE';
    default:
      return state;
  }
}


export function updateQuestion(state: any = 'NONE', action: ActionWithPayload<string>): string {
  switch (action.type) {
    case QuestionActions.UPDATE_QUESTION:
      return 'UPDATE';
    default:
      return null;
  }
}


