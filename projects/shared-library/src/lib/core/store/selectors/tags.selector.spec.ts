
import { testData } from 'test/data';
import { getTags } from './tags.selector';
describe('Tags:Selector', () => {
    const tags: string[] = testData.tagList;
    it('getTags', () => {
        const state = { core: { tags } };
        expect(getTags(state)).toBe(tags);
    });
});
