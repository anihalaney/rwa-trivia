import { TopicActions } from './topic.actions';
import { testData } from 'test/data';

describe('TopicAction: loadTopTopics', () => {
    it('Verify loadTopTopics function work correctly', () => {
        const action = new TopicActions().loadTopTopics();
        expect(action.type).toEqual(TopicActions.LOAD_TOP_TOPICS);
        expect(action.payload).toEqual(null);
    });
});

describe('TopicAction: loadTopTopicsSuccess', () => {
    it('Verify loadTopTopicsSuccess function work correctly', () => {
        const topics: any[] = testData.topTopics;
        const action = new TopicActions().loadTopTopicsSuccess(topics);
        expect(action.type).toEqual(TopicActions.LOAD_TOP_TOPICS_SUCEESS);
        expect(action.payload).toEqual(topics);
    });
});
