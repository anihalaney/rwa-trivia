import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { QuestionActions } from '../actions';
import { Question, SearchResults } from '../../../../../../shared-library/src/lib/shared/model';
import { questionOfTheDay } from './questions.reducer';
import { TEST_DATA } from '../../../testing/test.data';

describe('Reducer: questionOfTheDay', () => {
    const _testReducer = questionOfTheDay;
    const question: Question = TEST_DATA.questions.published.filter(obj => { return obj.id === '1' })[0];

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null, payload: null });

        expect(state).toEqual(null);
    });

    it('Get Question of the Day Question', () => {
        const state: String = _testReducer(null, {
            type: QuestionActions.GET_QUESTION_OF_THE_DAY,
            payload: question
        });

        const newState: String = _testReducer('SUCCESS', { type: QuestionActions.GET_QUESTION_OF_THE_DAY_SUCCESS, payload: question });

        const errorState: String = _testReducer('Error while getting Question',
            { type: QuestionActions.GET_QUESTION_OF_THE_DAY_ERROR, payload: 'Error while getting Question' });
        expect(errorState).toEqual('Error while getting Question');
    });

    it('Any other action', () => {
        const state: String = _testReducer('SUCCESS', { type: QuestionActions.ADD_QUESTION_SUCCESS, payload: null });
        expect(state).toEqual('SUCCESS');
    });

});