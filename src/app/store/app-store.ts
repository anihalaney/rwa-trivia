import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from '../core/store';

import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../game-play/store';
import * as userStore from '../user/store';
import * as coreStore from '../core/store';

//do we even need this?
export interface AppState {
  gameplayState: gamePlayStore.GamePlayState,
  userState: userStore.UserState,
  coreState: coreStore.CoreState,
  rootState: rootStoreReducers.State
}

export const appState = {
  gameplayState: gamePlayStore.gameplayState,
  userState: userStore.userState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;
