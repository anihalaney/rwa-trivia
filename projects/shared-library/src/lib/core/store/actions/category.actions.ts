import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Category } from '../../../shared/model';

@Injectable()
export class CategoryActions {

  static LOAD_CATEGORIES = 'LOAD_CATEGORIES';
  loadCategories(): ActionWithPayload<null> {
    return {
      type: CategoryActions.LOAD_CATEGORIES,
      payload: null
    };
  }

  static LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS';
  loadCategoriesSuccess(categories: Category[]): ActionWithPayload<Category[]> {
    return {
      type: CategoryActions.LOAD_CATEGORIES_SUCCESS,
      payload: categories
    };
  }

}
