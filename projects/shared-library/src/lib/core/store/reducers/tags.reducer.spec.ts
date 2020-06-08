import { tags, topTags } from './tags.reducer';
import { TagActions } from '../actions';
import { testData } from 'test/data';

describe('TagsReducer: tags', () => {
    const _testReducer = tags;

    it('Initial State', () => {
        const state: string[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify tags function when action type is `LOAD_TAGS_SUCCESS`', () => {
        const tagList: string[] = testData.tagList;

        const newState: string[] = _testReducer(tagList, { type: TagActions.LOAD_TAGS_SUCCESS, payload: tagList });
        expect(newState).toEqual(tagList);
    });
});

describe('TagsReducer: topTags', () => {
    const _testReducer = topTags;

    it('Initial State', () => {
        const state: any[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify topTags function when action type is `LOAD_TOP_TAGS_SUCEESS`', () => {
        const tagList: any[] = testData.tagList;

        const newState: any[] = _testReducer(tagList, { type: TagActions.LOAD_TOP_TAGS_SUCEESS, payload: tagList });
        expect(newState).toEqual(tagList);
    });
});
