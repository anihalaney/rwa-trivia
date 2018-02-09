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

export function userPublishedQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function userUnpublishedQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};


// file Unpublished Questions
export function bulkUploadUnpublishedQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

// file Published Questions
export function bulkUploadPublishedQuestions(state: any = [], action: ActionWithPayload<Question[]>): Question[] {
  switch (action.type) {
    case QuestionActions.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export function questionOfTheDay(state: any = [], action: ActionWithPayload<Question>): Question {
  switch (action.type) {
    case QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS:
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

export function deleteUnpublishedQuestion(state: any = "NONE", action: ActionWithPayload<string>): string {
  switch (action.type) {
    case QuestionActions.DELETE_UNPUBLISHED_QUESTION:
      return "IN PROGRESS";
    default:
      return state;
  }
};
