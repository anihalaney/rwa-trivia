import { Category } from '../model';

import { categories } from './reducers';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
  categories: Category[];
}

export default compose(combineReducers)({
    categories: categories
});
