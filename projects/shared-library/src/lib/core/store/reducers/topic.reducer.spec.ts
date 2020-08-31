import { topTopics } from './topic.reducer';
import { testData } from 'test/data';
import { Topic } from 'shared-library/shared/model';
import { TopicActions } from '../actions';

describe('TopicReducer: topTopics', () => {
    const _testReducer = topTopics;

    it('Initial State', () => {
        const state: Topic[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify topTopics function when action type is `LOAD_TOP_TOPICS_SUCCEESS`', () => {
        const categoryData: any[] = [];
        const topics: Topic[] = [];
        categoryData.push(testData.categoryDictionary);
        categoryData.map((data: Topic) => {
            topics[data.id] = data;
        });

        const newState: Topic[] = _testReducer(topics, { type: TopicActions.LOAD_TOP_TOPICS_SUCCEESS, payload: topics });
        expect(newState).toEqual(topics);
    });
});
