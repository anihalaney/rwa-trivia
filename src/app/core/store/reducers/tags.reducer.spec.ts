import { tags } from './tags.reducer';
import { TagActions } from '../actions';

describe('TagsReducer', () => {
  
  it('Tags Reducer Initial State', () => {
    let state: string[] = tags(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Tags Reducer Load Tags Success', () => {
    let initialTagList: string[] = ["C++", "Swift", "Ionic"];
    let state: string[] = tags(["C++"], {type: TagActions.LOAD_TAGS_SUCCESS, payload: initialTagList});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialTagList.length);

    let tagList: string[] = ["Python", "Scala"];
    let newState: string[] = tags(["C++"], {type: TagActions.LOAD_TAGS_SUCCESS, payload: tagList});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(tagList.length);
    expect(newState).not.toEqual(state);
  });

  it('Tags Reducer Other', () => {
    let tagList: string[] = ["Python", "Scala"];
    let state: string[] = tags(tagList, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(tagList.length);
  });

});
