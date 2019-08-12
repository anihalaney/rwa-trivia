import { Injectable } from '@angular/core';
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

  static LOAD_TOP_CATEGORIES = 'LOAD_TOP_CATEGORIES';
  loadTopCategories(): ActionWithPayload<any[]> {
    return {
      type: CategoryActions.LOAD_TOP_CATEGORIES,
      payload: null
    };
  }

  
  static LOAD_TOP_CATEGORIES_SUCEESS = 'LOAD_TOP_CATEGORIES_SUCEESS';
  loadTopCategoriesSuccess(categories: any[]): ActionWithPayload<any[]> {
    return {
      type: CategoryActions.LOAD_TOP_CATEGORIES_SUCEESS,
      payload: categories
    };
  }

}
