import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import {Action} from '@ngrx/store';

import { QuestionActions } from '../actions/question.actions';
import { Question } from '../../model/question';

export const questions = (state: any = [], action: Action): Question[] => {
  switch (action.type) {
    case QuestionActions.LOAD_QUESTIONS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
