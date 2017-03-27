import { TEST_DATA } from '../../../testing/test.data';
import { categories, categoryDictionary } from './categories.reducer';
import { CategoryActions } from '../actions';
import { Category } from '../../../model';

describe('Reducer: categories', () => {
  
  it('Initial State', () => {
    let state: Category[] = categories(undefined, {type: null, payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(0);
  });

  it('Load Categories Success Action', () => {
    let initialCategories: Category[] = [{ "id": 1, "categoryName": "Test" }];
    let state: Category[] = categories(null, {type: CategoryActions.LOAD_CATEGORIES_SUCCESS, payload: initialCategories});
    expect(Array.isArray(state)).toEqual(true);
    expect(state.length).toEqual(initialCategories.length);

    let newState: Category[] = categories(initialCategories, {type: CategoryActions.LOAD_CATEGORIES_SUCCESS, payload: TEST_DATA.categories});

    expect(Array.isArray(newState)).toEqual(true);
    expect(newState.length).toEqual(TEST_DATA.categories.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: Category[] = categories(TEST_DATA.categories, {type: "any other action", payload: null});

    expect(Array.isArray(state)).toEqual(true);
    expect(state).toEqual(TEST_DATA.categories);
  });

});

describe('Reducer: categoriesDictionary', () => {
  
  it('Initial State', () => {
    let state: {[key: number]: Category} = categoryDictionary(undefined, {type: null, payload: null});

    expect(typeof state).toEqual('object');
    expect(Object.keys(state).length).toEqual(0);
  });

  it('Load Categories Success Action', () => {
    let initialCategories: Category[] = [{ "id": 1, "categoryName": "Test" }];
    let state: {[key: number]: Category} = categoryDictionary(null, {type: CategoryActions.LOAD_CATEGORIES_SUCCESS, payload: initialCategories});
    expect(typeof state).toEqual('object');
    expect(Object.keys(state).length).toEqual(initialCategories.length);

    let newState: {[key: number]: Category} = categoryDictionary(initialCategories, {type: CategoryActions.LOAD_CATEGORIES_SUCCESS, payload: TEST_DATA.categories});

    expect(typeof newState).toEqual('object');
    expect(Object.keys(newState).length).toEqual(TEST_DATA.categories.length);
    expect(newState).not.toEqual(state);
  });

  it('Any other action', () => {
    let state: {[key: number]: Category} = categoryDictionary(TEST_DATA.categories, {type: "any other action", payload: null});

    expect(typeof state).toEqual('object');
    expect(state).toEqual(TEST_DATA.categories);
  });

});
