import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { AdminActions, AdminActionTypes } from '../actions';
import { SearchResults, Question } from '../../../model';

// Load Question As per Search criteria
export function questionsSearchResults(state: any = [], action: AdminActions): SearchResults {
    switch (action.type) {
        case AdminActionTypes.LOAD_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// Load All Unpublished Question
export function unpublishedQuestions(state: any = [], action: AdminActions): Question[] {
    switch (action.type) {
      case AdminActionTypes.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  };
