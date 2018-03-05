import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ActionWithPayload, QuestionActions } from '../actions';
import { Question, SearchResults } from '../../../model';


export function questionOfTheDay(state: any = [], action: ActionWithPayload<Question>): Question {
  switch (action.type) {
    case QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};


