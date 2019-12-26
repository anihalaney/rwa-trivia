import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const getTopics = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.topics);
export const topicDictionary = createSelector(getTopics, fromFeature.getTopicsDictionary);
export const getTopTopics  = createSelector(fromFeature.coreState, (state: fromFeature.CoreState) => state.topTopics);
