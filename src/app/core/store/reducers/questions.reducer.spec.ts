import { TEST_DATA } from '../../../testing/test.data';
import { questions, questionSaveStatus, userQuestions, 
         sampleQuestions, unpublishedQuestions } from './questions.reducer';
import { QuestionActions } from '../actions';
import { Question, QuestionStatus } from '../../../model';

//questions
describe('Reducer: questions', () => {
  let _testReducer = questions;
  
  it('Initial State', () => {
    let state: Question[] = _testReducer(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load Questions Success Action', () => {
    let initialQuestions: Question[] = TEST_DATA.questions.published.slice(0, 2);
    let state: Question[] = _testReducer(null, {type: QuestionActions.LOAD_QUESTIONS_SUCCESS, payload: initialQuestions});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialQuestions.length);

    let newState: Question[] = _testReducer(initialQuestions, {type: QuestionActions.LOAD_QUESTIONS_SUCCESS, payload: TEST_DATA.questions.published});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.questions.published.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: Question[] = _testReducer(TEST_DATA.questions.published, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.questions.published);
  });

});

//unpublishedQuestions
describe('Reducer: unpublishedQuestions', () => {
  let _testReducer = unpublishedQuestions;
  
  it('Initial State', () => {
    let state: Question[] = _testReducer(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load Unpublished Questions Success Action', () => {
    let initialQuestions: Question[] = TEST_DATA.questions.published.slice(0, 2);
    let state: Question[] = _testReducer(null, {type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS, payload: initialQuestions});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialQuestions.length);

    let newState: Question[] = _testReducer(initialQuestions, {type: QuestionActions.LOAD_UNPUBLISHED_QUESTIONS_SUCCESS, payload: TEST_DATA.questions.published});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.questions.published.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: Question[] = _testReducer(TEST_DATA.questions.published, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.questions.published);
  });

});


//userQuestions
describe('Reducer: userQuestions', () => {
  let _testReducer = userQuestions;
  
  it('Initial State', () => {
    let state: Question[] = _testReducer(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load User Questions Success Action', () => {
    let initialQuestions: Question[] = TEST_DATA.questions.published.slice(0, 2);
    let state: Question[] = _testReducer(null, {type: QuestionActions.LOAD_USER_QUESTIONS_SUCCESS, payload: initialQuestions});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialQuestions.length);

    let newState: Question[] = _testReducer(initialQuestions, {type: QuestionActions.LOAD_USER_QUESTIONS_SUCCESS, payload: TEST_DATA.questions.published});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.questions.published.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: Question[] = _testReducer(TEST_DATA.questions.published, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.questions.published);
  });

});

//sampleQuestions
describe('Reducer: sampleQuestions', () => {
  let _testReducer = sampleQuestions;
  
  it('Initial State', () => {
    let state: Question[] = _testReducer(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load Sample Questions Success Action', () => {
    let initialQuestions: Question[] = TEST_DATA.questions.published.slice(0, 2);
    let state: Question[] = _testReducer(null, {type: QuestionActions.LOAD_SAMPLE_QUESTIONS_SUCCESS, payload: initialQuestions});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialQuestions.length);

    let newState: Question[] = _testReducer(initialQuestions, {type: QuestionActions.LOAD_SAMPLE_QUESTIONS_SUCCESS, payload: TEST_DATA.questions.published});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.questions.published.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: Question[] = _testReducer(TEST_DATA.questions.published, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.questions.published);
  });

});

//questionSaveStatus
describe('Reducer: sampleQuestions', () => {
  let _testReducer = questionSaveStatus;
  
  it('Initial State', () => {
    let state: string = _testReducer(undefined, {type: null, payload: null});

    expect(state).toEqual("NONE");
  });

  it('Add Questions Actions', () => {
    let state: string = _testReducer(null, {type: QuestionActions.ADD_QUESTION});
    expect(state).toEqual("IN PROGRESS");

    let newState: string = _testReducer("IN PROGRESS", {type: QuestionActions.ADD_QUESTION_SUCCESS});
    expect(newState).toEqual("SUCCESS");
  });

  it('Any other action', () => {
    let state: string = _testReducer("IN PROGRESS", {type: "any other action", payload: null});

    expect(state).toEqual("IN PROGRESS");
  });

});
