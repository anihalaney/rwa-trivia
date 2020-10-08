import { categories, getCategoryDictionary, topCategories } from './categories.reducer';
import { testData } from 'test/data';
import { Category } from '../../../shared/model';
import { CategoryActions } from '../actions';

describe('Reducer: categories', () => {
    const _testReducer = categories;
    const category: Category[] = testData.categoryList;

    it('Initial State', () => {
        const state: Category[] = _testReducer(undefined, { type: null, payload: [] });
        expect(state).toEqual([]);
    });

    it('Load all categories', () => {
        const newState = _testReducer(category, { type: CategoryActions.LOAD_CATEGORIES_SUCCESS, payload: category });
        expect(newState).toEqual(category);
    });
});

describe('Reducer: getCategoryDictionary', () => {
    const _testReducer = getCategoryDictionary;
    const category: Category[] = testData.categoryList;

    it('Verify getCategoryDictionary function', () => {
        const newState = _testReducer(category);
        expect(newState).toEqual(testData.categoryDictionary);
    });

    it('Verify getCategoryDictionary function when categories not avaiable', () => {
        const newState = _testReducer(undefined);
        expect(newState).toEqual({});
    });
});

describe('Reducer: topCategories', () => {
    const _testReducer = topCategories;
    const category: any[] = testData.categoryList;

    it('Initial State', () => {
        const state: Category[] = _testReducer(undefined, { type: null, payload: [] });
        expect(state).toEqual([]);
    });

    it('Verify top loaded categories', () => {
        const state: any[] = _testReducer(category, { type: CategoryActions.LOAD_TOP_CATEGORIES_SUCEESS, payload: category });
        expect(state).toEqual(category);
    });
});
