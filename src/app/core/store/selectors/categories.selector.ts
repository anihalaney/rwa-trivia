import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getCategories = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.categories);
export const categoryDictionary = createSelector(getCategories, fromFeature.getCategoryDictionary);
