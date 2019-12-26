import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from 'shared-library/core/store';
import * as coreStore from 'shared-library/core/store';


//do we even need this?
export interface AppState {
  coreState: coreStore.CoreState
}

export const appState = {
  coreState: coreStore.coreState,
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;
export const getTopics = coreStore.getTopics;

