import { Question } from '../../../shared/model';
import { QuestionActions } from './question.actions';
// import { TEST_DATA } from '../../../testing/test.data';
import { testData } from 'test/data';

describe('QuestionAction: getQuestionOfTheDay', () => {
  it('should create an action', () => {
    const action = new QuestionActions().getQuestionOfTheDay();
    expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY);
    expect(action.payload).toEqual(null);
  });
});

describe('QuestionAction: getQuestionOfTheDaySuccess', () => {
  it('should create an action', () => {
    const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
    const action = new QuestionActions().getQuestionOfTheDaySuccess(question);
    expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS);
    expect(action.payload).toEqual(question);
  });
});

describe('QuestionAction: getQuestionOfTheDayError', () => {
  it('Verify getQuestionOfTheDayError function work correctly', () => {
    const errorObj: any = 'Something went wrong please try again later';
    const action = new QuestionActions().getQuestionOfTheDayError(errorObj);
    expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR);
    expect(action.payload).toEqual(errorObj);
  });
});

describe('QuestionAction: getFirstQuestion', () => {
  it('Verify getFirstQuestion function work correctly', () => {
    const action = new QuestionActions().getFirstQuestion();
    expect(action.type).toEqual(QuestionActions.GET_FIRST_QUESTION);
    expect(action.payload).toEqual(null);
  });
});

describe('QuestionAction: getFirstQuestionSuccess', () => {
  it('Verify getFirstQuestionSuccess function work correctly', () => {
    const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
    const action = new QuestionActions().getFirstQuestionSuccess(question);
    expect(action.type).toEqual(QuestionActions.GET_FIRST_QUESTION_SUCCESS);
    expect(action.payload).toEqual(question);
  });
});

describe('QuestionAction: getFirstQuestionError', () => {
  it('Verify getFirstQuestionError function work correctly', () => {
    const errorObj: any = 'Something went wrong please try again later';
    const action = new QuestionActions().getFirstQuestionError(errorObj);
    expect(action.type).toEqual(QuestionActions.GET_FIRST_QUESTION_ERROR);
    expect(action.payload).toEqual(errorObj);
  });
});

describe('QuestionAction: addQuestionSuccess', () => {
  it('Verify addQuestionSuccess function work correctly', () => {
    const action = new QuestionActions().addQuestionSuccess();
    expect(action.type).toEqual(QuestionActions.ADD_QUESTION_SUCCESS);
    expect(action.payload).toEqual(null);
  });
});

describe('QuestionAction: addQuestionDraftSuccess', () => {
  it('Verify addQuestionDraftSuccess function work correctly', () => {
    const questionId = testData.questions.published.filter(obj => obj.id === '1')[0].id;
    const action = new QuestionActions().addQuestionDraftSuccess(questionId);
    expect(action.type).toEqual(QuestionActions.ADD_NEW_QUESTION_AS_DRAFT_SUCCESS);
    expect(action.payload).toEqual(questionId);
  });
});

describe('QuestionAction: updateQuestionDraftSuccess', () => {
  it('Verify updateQuestionDraftSuccess function work correctly', () => {
    const action = new QuestionActions().updateQuestionDraftSuccess();
    expect(action.type).toEqual(QuestionActions.UPDATE_QUESTION_AS_DRAFT_SUCCESS);
    expect(action.payload).toEqual(null);
  });
});

describe('QuestionAction: resetQuestionSuccess', () => {
  it('Verify resetQuestionSuccess function work correctly', () => {
    const action = new QuestionActions().resetQuestionSuccess();
    expect(action.type).toEqual(QuestionActions.RESET_QUESTION_SUCCESS);
    expect(action.payload).toEqual(null);
  });
});

describe('QuestionAction: updateQuestion', () => {
  it('Verify updateQuestion function work correctly', () => {
    const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
    const action = new QuestionActions().updateQuestion(question);
    expect(action.type).toEqual(QuestionActions.UPDATE_QUESTION);
    expect(action.payload).toEqual(question);
  });
});

describe('QuestionAction: deleteQuestionImage', () => {
  it('Verify deleteQuestionImage function work correctly', () => {
    const imageName = 'question01.jpg';
    const action = new QuestionActions().deleteQuestionImage(imageName);
    expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE);
    expect(action.payload).toEqual(imageName);
  });
});

describe('QuestionAction: deleteQuestionImageSuccess', () => {
  it('Verify deleteQuestionImageSuccess function work correctly', () => {
    const msg = 'Image deleted successfully';
    const action = new QuestionActions().deleteQuestionImageSuccess(msg);
    expect(action.type).toEqual(QuestionActions.DELETE_QUESTION_IMAGE_SUCCESS);
    expect(action.payload).toEqual(msg);
  });
});
