import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ActionWithPayload, QuestionActions } from '../actions';
import { Question, SearchResults } from '../../../shared/model';


export function questionOfTheDay(state: any = null, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS:
      return action.payload;
    case QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR:
      return action.payload;
    default:
      return state;
  }
};


export function questionSaveStatus(state: any = 'NONE', action: ActionWithPayload<string>): string {
  switch (action.type) {
    case QuestionActions.ADD_QUESTION_SUCCESS:
      return 'SUCCESS';
    default:
      return state;
  }
};

