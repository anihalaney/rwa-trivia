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

  static GET_QUESTION_OF_THE_DAY_ERROR = 'GET_QUESTION_OF_THE_DAY_ERROR';
  getQuestionOfTheDayError(errorObj: any): ActionWithPayload<any> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR,
      payload: errorObj
    };
  }

  static GET_FIRST_QUESTION = 'GET_FIRST_QUESTION';
  getFirstQuestion(): ActionWithPayload<null> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION,
      payload: null
    };
  }

  static GET_FIRST_QUESTION_SUCCESS = 'GET_FIRST_QUESTION_SUCCESS';
  getFirstQuestionSuccess(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION_SUCCESS,
      payload: question
    };
  }

  static GET_FIRST_QUESTION_ERROR = 'GET_FIRST_QUESTION_ERROR';
  getFirstQuestionError(errorObj: any): ActionWithPayload<any> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION_ERROR,
      payload: errorObj
    };
  }

  static ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
  addQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.ADD_QUESTION_SUCCESS,
      payload: null
    };
  }


  static ADD_NEW_QUESTION_AS_DRAFT_SUCCESS = 'ADD_NEW_QUESTION_AS_DRAFT_SUCCESS';
  addQuestionDraftSuccess(questionId): ActionWithPayload<string> {
    return {
      type: QuestionActions.ADD_NEW_QUESTION_AS_DRAFT_SUCCESS,
      payload: questionId
    };
  }

  static UPDATE_QUESTION_AS_DRAFT_SUCCESS = 'UPDATE_QUESTION_AS_DRAFT_SUCCESS';
  updateQuestionDraftSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.UPDATE_QUESTION_AS_DRAFT_SUCCESS,
      payload: null
    };
  }

  static RESET_QUESTION_SUCCESS = 'RESET_QUESTION_SUCCESS';
  resetQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.RESET_QUESTION_SUCCESS,
      payload: null
    };
  }


  static UPDATE_QUESTION = 'UPDATE_QUESTION';
  updateQuestion(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.UPDATE_QUESTION,
      payload: question
    };
  }

  static DELETE_QUESTION_IMAGE = 'DELETE_QUESTION_IMAGE';
  deleteQuestionImage(imageName: string): ActionWithPayload<string> {
    return {
      type: QuestionActions.DELETE_QUESTION_IMAGE,
      payload: imageName
    };
  }

  static DELETE_QUESTION_IMAGE_SUCCESS = 'DELETE_QUESTION_IMAGE_SUCCESS';
  deleteQuestionImageSuccess(msg: string): ActionWithPayload<string> {
    return {
      type: QuestionActions.DELETE_QUESTION_IMAGE_SUCCESS,
      payload: msg
    };
  }

}
