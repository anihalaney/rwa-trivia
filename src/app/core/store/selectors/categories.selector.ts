import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import {getCategoryDictionary} from '../reducers';
import * as coreState from '../app-store';

export const getCategories = createSelector(coreState.getState, (state: coreState.AppStore) => state.categories);
export const categoryDictionary = createSelector(getCategories, getCategoryDictionary);
