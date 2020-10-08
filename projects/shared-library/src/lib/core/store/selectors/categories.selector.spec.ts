
import { testData } from 'test/data';
import { categoryDictionary, getCategories } from './categories.selector';
describe('Categories:Selector', () => {
    const categories = testData.categoryList;
    const categoryDict = testData.categoryDictionary;

    it('getCategories', () => {
        const state = { core: { categories } };
        expect(getCategories(state)).toBe(categories);
    });

    it('categoryDictionary', () => {
        const state = { core: { categories } };
        expect(categoryDictionary(state)).toEqual(categoryDict);
    });
});

