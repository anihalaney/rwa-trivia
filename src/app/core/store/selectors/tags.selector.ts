import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getTags = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.tags);

