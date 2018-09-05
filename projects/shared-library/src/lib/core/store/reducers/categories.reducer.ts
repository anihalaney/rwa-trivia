import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ActionWithPayload, CategoryActions } from '../actions';
import { Category } from '../../../shared/model';

export function categories(state: any = [], action: ActionWithPayload<Category[]>): Category[] {
  switch (action.type) {
    case CategoryActions.LOAD_CATEGORIES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

//selectors
export const getCategoryDictionary = (state: Category[]) =>
  state.reduce((result, category) => {
    result[category.id] = category;
    return result;
  }, {});

