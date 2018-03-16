import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from '../core/store';

import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../game-play/store';
import * as userStore from '../user/store';
import * as bulkStore from '../bulk/store';
import * as adminStore from '../admin/store';
import * as coreStore from '../core/store';

//do we even need this?
export interface AppState {
  gameplayState: gamePlayStore.GamePlayState,
  userState: userStore.UserState,
  bulkState: bulkStore.BulkState,
  adminState: adminStore.AdminState,
  coreState: coreStore.CoreState,
  rootState: rootStoreReducers.State
}

export const appState = {
  gameplayState: gamePlayStore.gameplayState,
  userState: userStore.userState,
  bulkState: bulkStore.bulkState,
  adminState: adminStore.adminState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;
