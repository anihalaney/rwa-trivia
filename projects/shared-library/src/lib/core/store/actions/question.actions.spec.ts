import { Question } from '../../../shared/model';
import { QuestionActions } from './question.actions';
// import { TEST_DATA } from '../../../testing/test.data';
import { testData } from 'test/data';

describe('getQuestionOfTheDay', () => {
  it('should create an action', () => {
    const action = new QuestionActions().getQuestionOfTheDay();
    expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY);
    expect(action.payload).toEqual(null);
  });
});

describe('getQuestionOfTheDaySuccess', () => {
  it('should create an action', () => {
    const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
    const action = new QuestionActions().getQuestionOfTheDaySuccess(question);
    expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS);
    expect(action.payload).toEqual(question);
  });
});

describe('getFirstQuestion', () => {
  it('should create an action', () => {
    const action = new QuestionActions().getFirstQuestion();
    expect(action.type).toEqual(QuestionActions.GET_FIRST_QUESTION);
    expect(action.payload).toEqual(null);
  });

  describe('getFirstQuestionSuccess', () => {
    it('should create an action', () => {
      const question: Question = testData.questions.published.filter(obj => obj.id === '1')[0];
      const action = new QuestionActions().getFirstQuestionSuccess(question);
      expect(action.type).toEqual(QuestionActions.GET_FIRST_QUESTION_SUCCESS);
      expect(action.payload).toEqual(question);
    });
  });

});
