import { CategoryActions } from './category.actions';
import { testData } from 'test/data';


describe('loadCategories', () => {
    it('should create an action', () => {
        const action = new CategoryActions().loadCategories();
        expect(action.type).toEqual(CategoryActions.LOAD_CATEGORIES);
        expect(action.payload).toEqual(null);
    });
});

describe('loadCategoriesSuccess', () => {
    it('should create an action', () => {
        const action = new CategoryActions().loadCategoriesSuccess(testData.categories.categories);
        expect(action.type).toEqual(CategoryActions.LOAD_CATEGORIES_SUCCESS);
        expect(action.payload).toEqual(testData.categories.categories);
    });
});

describe('loadTopCategories', () => {
    it('should create an action', () => {
        const action = new CategoryActions().loadTopCategories();
        expect(action.type).toEqual(CategoryActions.LOAD_TOP_CATEGORIES);
        expect(action.payload).toEqual(null);
    });
});

describe('loadTopCategoriesSuccess', () => {
    it('should create an action', () => {
        const action = new CategoryActions().loadTopCategoriesSuccess(testData.categories.categories);
        expect(action.type).toEqual(CategoryActions.LOAD_TOP_CATEGORIES_SUCEESS);
        expect(action.payload).toEqual(testData.categories.categories);
    });
});