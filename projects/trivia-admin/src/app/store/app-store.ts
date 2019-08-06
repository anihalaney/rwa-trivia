import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from 'shared-library/core/store';
import * as coreStore from 'shared-library/core/store';
import * as adminStore from '../admin/store';
import { adminState } from '../admin/store';

//do we even need this?
export interface AppState {
  coreState: coreStore.CoreState,
  adminState: adminStore.AdminState
}

export const appState = {
  coreState: coreStore.coreState,
  adminState: adminStore.adminState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories;
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;

