
import { testData } from 'test/data';
import { getTopTopics } from './topics.selector';
import { Topic } from 'shared-library/shared/model';
describe('Topics:Selector', () => {
    const topTopics: Topic[] = testData.topics;

    it('Get User selector return user object', () => {
        const state = { core: { topTopics } };
        expect(getTopTopics(state)).toBe(topTopics);
    });
});
