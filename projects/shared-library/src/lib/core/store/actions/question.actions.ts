import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Question } from '../../../shared/model';

@Injectable()
export class QuestionActions {

  static GET_QUESTION_OF_THE_DAY = 'GET_QUESTION_OF_THE_DAY';
  getQuestionOfTheDay(): ActionWithPayload<null> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY,
      payload: null
    };
  }

  static GET_QUESTION_OF_THE_DAY_SUCCESS = 'GET_QUESTION_OF_THE_DAY_SUCCESS';
  getQuestionOfTheDaySuccess(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS,
      payload: question
    };
  }

  static ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
  addQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.ADD_QUESTION_SUCCESS,
      payload: null
    };
  }

  static GET_QUESTION_OF_THE_DAY_ERROR = 'GET_QUESTION_OF_THE_DAY_ERROR';
  getQuestionOfTheDayError(errorObj: any): ActionWithPayload<any> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR,
      payload: errorObj
    };
  }

}
