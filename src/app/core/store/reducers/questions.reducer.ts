import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import { ActionWithPayload, QuestionActions } from '../actions';
import { Question, SearchResults } from '../../../model';

export function questionsSearchResults(state: any = [], action: ActionWithPayload<SearchResults>): SearchResults {
  switch (action.type) {
    case QuestionActions.LOAD_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function unpublishedQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function userQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_USER_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function sampleQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_SAMPLE_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function questionSaveStatus(state: any = "NONE", action: ActionWithPayload<string>): string {
  switch (action.type) {
    case QuestionActions.ADD_QUESTION:
      return "IN PROGRESS";
    case QuestionActions.ADD_QUESTION_SUCCESS:
      return "SUCCESS";
    default:
      return state;
  }
};
