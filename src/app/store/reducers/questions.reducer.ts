import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import {Action} from '@ngrx/store';

import { QuestionActions } from '../actions/question.actions';
import { Question } from '../../model/question';

export const questions = (state: any = [], action: Action): Question[] => {
  switch (action.type) {
    case QuestionActions.LOAD_QUESTIONS_SUCCESS:
      return action.payload;
    case QuestionActions.ADD_QUESTION_SUCCESS:
      return [...state, ...action.payload];
    default:
      return state;
  }
};

export const questionSaveStatus = (state: any = "NONE", action: Action): string => {
  switch (action.type) {
    case QuestionActions.ADD_QUESTION:
      return "IN PROGRESS";
    case QuestionActions.ADD_QUESTION_SUCCESS:
      return "SUCCESS";
    default:
      return state;
  }
};
