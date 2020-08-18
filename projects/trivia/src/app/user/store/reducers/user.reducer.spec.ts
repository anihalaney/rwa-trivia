import { Question, User } from 'shared-library/shared/model';
import { UserActions, UserActionTypes } from '../actions';
import { UserActions as UAction } from 'shared-library/core/store';
import { testData } from 'test/data';
import { userPublishedQuestions, userUnpublishedQuestions } from './user.reducer';

describe('Reducer: userPublishedQuestions', () => {
    const _testReducer = userPublishedQuestions;
    const questions: Question[] = testData.questions.published;

    it('Initial State', () => {
      const state: any[] = _testReducer(undefined, { type: null, payload: null });
      expect(state).toEqual([]);
    });

    it('Get user Published Question', () => {
      const newState: any[] = _testReducer(questions,
        { type: UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS, payload: questions });
      expect(newState).toEqual(questions);
    });

  });

  describe('Reducer: userUnpublishedQuestions', () => {
    const _testReducer = userUnpublishedQuestions;
    const questions: Question[] = testData.questions.unpublished;

    it('Initial State', () => {
      const state: any[] = _testReducer(undefined, { type: null, payload: null });
      expect(state).toEqual([]);
    });

    it('Get user Published Question', () => {
      const newState: any[] = _testReducer(questions,
        { type: UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS, payload: questions });
      expect(newState).toEqual(questions);
    });

  });
