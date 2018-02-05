import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import { Question, User, SearchResults, SearchCriteria, BulkUpload} from '../../../model';

@Injectable()
export class QuestionActions {

  static LOAD_QUESTIONS = 'LOAD_QUESTIONS';
  loadQuestions(payload: {startRow: number, pageSize: number, criteria: SearchCriteria}): ActionWithPayload<{startRow: number, pageSize: number, criteria: SearchCriteria}> {
    return {
      type: QuestionActions.LOAD_QUESTIONS,
      payload: payload
    };
  }

  static LOAD_QUESTIONS_SUCCESS = 'LOAD_QUESTIONS_SUCCESS';
  loadQuestionsSuccess(results: SearchResults): ActionWithPayload<SearchResults> {
    return {
      type: QuestionActions.LOAD_QUESTIONS_SUCCESS,
      payload: results
    };
  }

  static LOAD_UNPUBLISHED_QUESTIONS = 'LOAD_UNPUBLISHED_QUESTIONS';
  loadUnpublishedQuestions(): ActionWithPayload<null> {
    return {
      type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS,
      payload: null
    };
  }

  static LOAD_UNPUBLISHED_QUESTIONS_SUCCESS = 'LOAD_UNPUBLISHED_QUESTIONS_SUCCESS';
  loadUnpublishedQuestionsSuccess(questions: Question[]): ActionWithPayload<Question[]> {
    return {
      type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static LOAD_USER_PUBLISHED_QUESTIONS = 'LOAD_USER_PUBLISHED_QUESTIONS';
  loadUserPublishedQuestions(user: User): ActionWithPayload<User> {
    return {
      type: QuestionActions.LOAD_USER_PUBLISHED_QUESTIONS,
      payload: user
    };
  }

  static LOAD_USER_UNPUBLISHED_QUESTIONS = 'LOAD_USER_UNPUBLISHED_QUESTIONS';
  loadUserUnpublishedQuestions(user: User): ActionWithPayload<User> {
    return {
      type: QuestionActions.LOAD_USER_UNPUBLISHED_QUESTIONS,
      payload: user
    };
  }

  static LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS = 'LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS';
  loadUserPublishedQuestionsSuccess(questions: Question[]): ActionWithPayload<Question[]> {
    return {
      type: QuestionActions.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS = 'LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS';
  loadUserUnpublishedQuestionsSuccess(questions: Question[]): ActionWithPayload<Question[]> {
    return {
      type: QuestionActions.LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

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

  static ADD_QUESTION = 'ADD_QUESTION';
  addQuestion(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.ADD_QUESTION,
      payload: question
    };
  }

  static ADD_BULK_QUESTIONS = 'ADD_BULK_QUESTIONS';
  addBulkQuestions(bulkUpload: BulkUpload ):
  ActionWithPayload<BulkUpload> {
    return {
      type: QuestionActions.ADD_BULK_QUESTIONS,
      payload: bulkUpload
    };
  }
  static ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
  addQuestionSuccess(): ActionWithPayload<null> {
    return {
      type: QuestionActions.ADD_QUESTION_SUCCESS,
      payload: null
    };
  }

  static APPROVE_QUESTION = 'APPROVE_QUESTION';
  approveQuestion(question: Question): ActionWithPayload<Question> {
    return {
      type: QuestionActions.APPROVE_QUESTION,
      payload: question
    };
  }

}
