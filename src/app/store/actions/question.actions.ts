import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import { Question, User } from '../../model';

@Injectable()
export class QuestionActions {

  static LOAD_QUESTIONS = 'LOAD_QUESTIONS';
  loadQuestions(): Action {
    return {
      type: QuestionActions.LOAD_QUESTIONS
    };
  }

  static LOAD_QUESTIONS_SUCCESS = 'LOAD_QUESTIONS_SUCCESS';
  loadQuestionsSuccess(questions: Question[]): Action {
    return {
      type: QuestionActions.LOAD_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static LOAD_UNPUBLISHED_QUESTIONS = 'LOAD_UNPUBLISHED_QUESTIONS';
  loadUnpublishedQuestions(): Action {
    return {
      type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS
    };
  }

  static LOAD_UNPUBLISHED_QUESTIONS_SUCCESS = 'LOAD_UNPUBLISHED_QUESTIONS_SUCCESS';
  loadUnpublishedQuestionsSuccess(questions: Question[]): Action {
    return {
      type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static LOAD_USER_QUESTIONS = 'LOAD_USER_QUESTIONS';
  loadUserQuestions(user: User): Action {
    return {
      type: QuestionActions.LOAD_USER_QUESTIONS,
      payload: user
    };
  }

  static LOAD_USER_QUESTIONS_SUCCESS = 'LOAD_USER_QUESTIONS_SUCCESS';
  loadUserQuestionsSuccess(questions: Question[]): Action {
    return {
      type: QuestionActions.LOAD_USER_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static LOAD_SAMPLE_QUESTIONS = 'LOAD_SAMPLE_QUESTIONS';
  loadSampleQuestions(): Action {
    return {
      type: QuestionActions.LOAD_SAMPLE_QUESTIONS
    };
  }

  static LOAD_SAMPLE_QUESTIONS_SUCCESS = 'LOAD_SAMPLE_QUESTIONS_SUCCESS';
  loadSampleQuestionsSuccess(questions: Question[]): Action {
    return {
      type: QuestionActions.LOAD_SAMPLE_QUESTIONS_SUCCESS,
      payload: questions
    };
  }

  static ADD_QUESTION = 'ADD_QUESTION';
  addQuestion(question: Question): Action {
    return {
      type: QuestionActions.ADD_QUESTION,
      payload: question
    };
  }

  static ADD_QUESTION_SUCCESS = 'ADD_QUESTION_SUCCESS';
  addQuestionSuccess(): Action {
    return {
      type: QuestionActions.ADD_QUESTION_SUCCESS,
      payload: null
    };
  }

  static APPROVE_QUESTION = 'APPROVE_QUESTION';
  approveQuestion(question: Question): Action {
    return {
      type: QuestionActions.APPROVE_QUESTION,
      payload: question
    };
  }

}
