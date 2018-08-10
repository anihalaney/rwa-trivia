import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';


export const getUser = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.user);
export const authorizationHeader = createSelector(getUser, fromFeature.getAuthorizationHeader);


