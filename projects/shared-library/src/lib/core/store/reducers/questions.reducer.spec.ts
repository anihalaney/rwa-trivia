import { QuestionActions } from '../actions';
import { Question } from 'shared-library/shared/model';
import {
  questionOfTheDay, firstQuestion, questionSaveStatus, questionDraftSaveStatus,
  updateQuestion, deleteQuestionImage
} from './questions.reducer';
import { testData } from 'test/data';

describe('Reducer: questionOfTheDay', () => {
  const _testReducer = questionOfTheDay;
  const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];

  it('Initial State', () => {
    const state: String = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual(null);
  });

  it('Get Question of the Day Question', () => {
    const newState: String = _testReducer(question, { type: QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS, payload: question });
    expect(newState).toEqual(question);
  });

  it('Get Error message if has error', () => {
    const errorState: String = _testReducer('Error while getting Question',
      { type: QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR, payload: 'Error while getting Question' });
    expect(errorState).toEqual('Error while getting Question');
  });


});


describe('Reducer: firstQuestion', () => {
  const _testReducer = firstQuestion;
  const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];

  it('Get first Question', () => {
    const state: String = _testReducer(null, {
      type: QuestionActions.GET_FIRST_QUESTION,
      payload: question
    });

  });

  it('Get first Question', () => {
    const newState: String = _testReducer(question, { type: QuestionActions.GET_FIRST_QUESTION_SUCCESS, payload: question });
    expect(newState).toEqual(question);
  });
  it('Get Error message if has error', () => {
    const errorState: String = _testReducer('Error while getting Question',
      { type: QuestionActions.GET_FIRST_QUESTION_ERROR, payload: 'Error while getting Question' });
    expect(errorState).toEqual('Error while getting Question');
  });


});


describe('Reducer: questionSaveStatus', () => {
  const _testReducer = questionSaveStatus;
  it('Initial State should be null', () => {
    const initialState: String = _testReducer(null, { type: '', payload: null });
    expect(initialState).toEqual(null);
  });

  it('It should set state SUCCESS', () => {
    const newState: String = _testReducer('SUCCESS', { type: QuestionActions.ADD_QUESTION_SUCCESS, payload: null });
    expect(newState).toEqual('SUCCESS');
  });
  it('It should set state NONE', () => {
    const resetState: String = _testReducer('NONE', { type: QuestionActions.RESET_QUESTION_SUCCESS, payload: null });
    expect(resetState).toEqual('NONE');
  });
});

describe('Reducer: questionDraftSaveStatus', () => {
  const _testReducer = questionDraftSaveStatus;

  it('Initial State should be null', () => {
    const initialState: String = _testReducer(null, { type: '', payload: null });
    expect(initialState).toEqual(null);
  });

  const questionId = '2F4hJDnKih2md9QUgNEO1p';
  it('It should set state as question id', () => {
    const newState: String = _testReducer('SUCCESS', { type: QuestionActions.ADD_NEW_QUESTION_AS_DRAFT_SUCCESS, payload: questionId });
    expect(newState).toEqual(questionId);
  });
  it('It should set state UPDATED', () => {
    const resetState: String = _testReducer('UPDATED', { type: QuestionActions.UPDATE_QUESTION_AS_DRAFT_SUCCESS, payload: null });
    expect(resetState).toEqual('UPDATED');
  });
});


describe('Reducer: updateQuestion', () => {
  const _testReducer = updateQuestion;
  const question: Question = testData.questions.unpublished.filter(obj => obj.id === '0F2DHqEKdMIYujQHZt5k')[0];
  it('Initial State should be null', () => {
    const initialState: String = _testReducer(null, { type: '', payload: null });
    expect(initialState).toEqual(null);
  });

  it('It should set state as UPDATE', () => {
    const newState: String = _testReducer('UPDATE', { type: QuestionActions.UPDATE_QUESTION, payload: question });
    expect(newState).toEqual('UPDATE');
  });
});


describe('Reducer: deleteQuestionImage', () => {
  const _testReducer = deleteQuestionImage;

  it('Initial State should be null', () => {
    const initialState: String = _testReducer(null, { type: '', payload: null });
    expect(initialState).toEqual(null);
  });

  it('It should set state as question id', () => {
    const imageName = 'imageR3d55d';
    const newState: String = _testReducer(imageName, { type: QuestionActions.DELETE_QUESTION_IMAGE, payload: imageName });
    expect(newState).toEqual(imageName);
  });

  const response = { message: 'Deleted !!!' };
  it('It should set state as success response', () => {
    const newState: String = _testReducer(response, { type: QuestionActions.DELETE_QUESTION_IMAGE_SUCCESS, payload: response });
    expect(newState).toEqual(response);
  });
});

