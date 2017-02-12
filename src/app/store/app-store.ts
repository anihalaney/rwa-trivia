import { Category, Question } from '../model';

import { categories, tags, questions } from './reducers';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
  categories: Category[];
  tags: string[];
  questions: Question[];
}

export default compose(combineReducers)({
    categories: categories,
    tags: tags,
    questions: questions
});
