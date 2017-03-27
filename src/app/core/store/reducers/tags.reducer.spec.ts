import { TEST_DATA } from '../../../testing/test.data';
import { tags } from './tags.reducer';
import { TagActions } from '../actions';

describe('Reducer: tags', () => {
  
  it('Initial State', () => {
    let state: string[] = tags(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load Tags Success Action', () => {
    let initialTagList: string[] = ["C++", "Swift", "Ionic"];
    let state: string[] = tags(["C++"], {type: TagActions.LOAD_TAGS_SUCCESS, payload: initialTagList});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialTagList.length);

    let newState: string[] = tags(["C++"], {type: TagActions.LOAD_TAGS_SUCCESS, payload: TEST_DATA.tagList});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.tagList.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: string[] = tags(TEST_DATA.tagList, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.tagList);
  });

});
