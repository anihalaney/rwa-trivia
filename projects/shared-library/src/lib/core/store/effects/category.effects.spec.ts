import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { Actions } from '@ngrx/effects';
import { testData } from 'test/data';
import { CategoryEffects } from './category.effects';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryActions } from '../actions';
import { Category } from '../../../shared/model';

describe('CategoryEffects', () => {
    let effects: CategoryEffects;
    let actions$: Observable<any>;
    let categoryService: any;
    const categories: Category[] = testData.categoryList;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CategoryActions,
                CategoryEffects,
                {
                    provide: CategoryService,
                    useValue: { getCategories: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(CategoryEffects);
        categoryService = TestBed.get(CategoryService);
        actions$ = TestBed.get(Actions);
    });

    it('load categories', () => {
        const action = new CategoryActions().loadCategories();
        const completion = new CategoryActions().loadCategoriesSuccess(categories);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: categories });
        const expected = cold('--b', { b: completion });
        categoryService.getCategories = jest.fn(() => response);
        expect(effects.loadRouteCategories$).toBeObservable(expected);
    });

    it('load top categories', () => {
        const topCategories = testData.topTopics;
        const action = new CategoryActions().loadTopCategories();
        const completion = new CategoryActions().loadTopCategoriesSuccess(topCategories);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: topCategories });
        const expected = cold('--b', { b: completion });
        categoryService.getTopCategories = jest.fn(() => response);
        expect(effects.getTopCategories$).toBeObservable(expected);
    });

});

