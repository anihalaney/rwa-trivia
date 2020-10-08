import { Injectable } from '@angular/core';
import { ActionWithPayload } from './action-with-payload';
import { Question } from '../../../shared/model';

@Injectable()
export class QuestionActions {

  static GET_QUESTION_OF_THE_DAY = 'GET_QUESTION_OF_THE_DAY';
  static GET_QUESTION_OF_THE_DAY_SUCCESS = 'GET_QUESTION_OF_THE_DAY_SUCCESS';
  static GET_QUESTION_OF_THE_DAY_ERROR = 'GET_QUESTION_OF_THE_DAY_ERROR';
  static GET_FIRST_QUESTION = 'GET_FIRST_QUESTION';
  static GET_FIRST_QUESTION_SUCCESS = 'GET_FIRST_QUESTION_SUCCESS';
  static GET_FIRST_QUESTION_ERROR = 'GET_FIRST_QUESTION_ERROR';
  static ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
  static ADD_NEW_QUESTION_AS_DRAFT_SUCCESS = 'ADD_NEW_QUESTION_AS_DRAFT_SUCCESS';
  static UPDATE_QUESTION_AS_DRAFT_SUCCESS = 'UPDATE_QUESTION_AS_DRAFT_SUCCESS';
  static RESET_QUESTION_SUCCESS = 'RESET_QUESTION_SUCCESS';
  static UPDATE_QUESTION = 'UPDATE_QUESTION';
  static DELETE_QUESTION_IMAGE = 'DELETE_QUESTION_IMAGE';
  static DELETE_QUESTION_IMAGE_SUCCESS = 'DELETE_QUESTION_IMAGE_SUCCESS';

  getQuestionOfTheDay(): ActionWithPayload<null> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY,
      payload: null
    };
  }

  getQuestionOfTheDaySuccess(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS,
      payload: question
    };
  }

  getQuestionOfTheDayError(errorObj: any): ActionWithPayload<any> {
    return {
      type: QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR,
      payload: errorObj
    };
  }

  getFirstQuestion(): ActionWithPayload<null> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION,
      payload: null
    };
  }

  getFirstQuestionSuccess(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION_SUCCESS,
      payload: question
    };
  }

  getFirstQuestionError(errorObj: any): ActionWithPayload<any> {
    return {
      type: QuestionActions.GET_FIRST_QUESTION_ERROR,
      payload: errorObj
    };
  }

  addQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.ADD_QUESTION_SUCCESS,
      payload: null
    };
  }


  addQuestionDraftSuccess(questionId): ActionWithPayload<string> {
    return {
      type: QuestionActions.ADD_NEW_QUESTION_AS_DRAFT_SUCCESS,
      payload: questionId
    };
  }

  updateQuestionDraftSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.UPDATE_QUESTION_AS_DRAFT_SUCCESS,
      payload: null
    };
  }

  resetQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.RESET_QUESTION_SUCCESS,
      payload: null
    };
  }

  updateQuestion(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.UPDATE_QUESTION,
      payload: question
    };
  }

  deleteQuestionImage(imageName: string): ActionWithPayload<string> {
    return {
      type: QuestionActions.DELETE_QUESTION_IMAGE,
      payload: imageName
    };
  }

  deleteQuestionImageSuccess(msg: string): ActionWithPayload<string> {
    return {
      type: QuestionActions.DELETE_QUESTION_IMAGE_SUCCESS,
      payload: msg
    };
  }

}
