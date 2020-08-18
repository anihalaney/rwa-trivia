import { TopicActions } from './topic.actions';
import { testData } from 'test/data';


describe('loadTopics', () => {
  it('should create an action', () => {
    const action = new TopicActions().loadTopTopics();
    expect(action.type).toEqual(TopicActions.LOAD_TOP_TOPICS);
    expect(action.payload).toEqual(null);
  });
});


describe('loadTopicSuccess', () => {
  it('should create an action', () => {
    const action = new TopicActions().loadTopTopicsSuccess(testData.topTopics);
    expect(action.type).toEqual(TopicActions.LOAD_TOP_TOPICS_SUCEESS);
    expect(action.payload).toEqual(testData.topTopics);
  });
});