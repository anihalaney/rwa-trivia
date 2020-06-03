import { TagActions } from './tag.actions';
import { testData } from 'test/data';


describe('loadTags', () => {
    it('should create an action', () => {
        const action = new TagActions().loadTags();
        expect(action.type).toEqual(TagActions.LOAD_TAGS);
        expect(action.payload).toEqual(null);
    });
});

describe('loadTopTags', () => {
    it('should create an action', () => {
        const action = new TagActions().loadTopTags();
        expect(action.type).toEqual(TagActions.LOAD_TOP_TAGS);
        expect(action.payload).toEqual(null);
    });
});

describe('loadTagsSuccess', () => {
    it('should create an action', () => {
        const action = new TagActions().loadTagsSuccess(testData.tagList);
        expect(action.type).toEqual(TagActions.LOAD_TAGS_SUCCESS);
        expect(action.payload).toEqual(testData.tagList);
    });
});

describe('loadTopTagsSuccess', () => {
    it('should create an action', () => {
        const action = new TagActions().loadTopTagsSuccess(testData.tagList);
        expect(action.type).toEqual(TagActions.LOAD_TOP_TAGS_SUCEESS);
        expect(action.payload).toEqual(testData.tagList);
    });
});