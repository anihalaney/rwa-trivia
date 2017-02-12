import { Category, Question } from '../model';

import { categories, categoryDictionary, tags, questions, questionSaveStatus } from './reducers';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
  categories: Category[];
  categoryDictionary: {[key: number]: Category};
  tags: string[];
  questions: Question[];
  questionSaveStatus: string;
}

export default compose(combineReducers)({
    categories: categories,
    categoryDictionary: categoryDictionary,
    tags: tags,
    questions: questions,
    questionSaveStatus: questionSaveStatus
});
