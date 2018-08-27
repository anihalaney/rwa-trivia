import { Question } from '../../../shared/model';
import { QuestionActions } from './question.actions';
import { TEST_DATA } from '../../../testing/test.data';

describe('getQuestionOfTheDay', () => {
    it('should create an action', () => {
        const action = new QuestionActions().getQuestionOfTheDay();
        expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY);
        expect(action.payload).toEqual(null);
    });
});

describe('getQuestionOfTheDaySuccess', async () => {
    it('should create an action', () => {
        const question: Question = TEST_DATA.questions.published.filter(obj => { return obj.id === '1' })[0];
        const action = new QuestionActions().getQuestionOfTheDaySuccess(question);
        expect(action.type).toEqual(QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS);
        expect(action.payload).toEqual(question);
    });
});