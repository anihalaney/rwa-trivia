import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from '../core/store';

import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../game-play/store';
import * as coreStore from '../core/store';

//do we even need this?
export interface AppState {
  gameplayState: gamePlayStore.GamePlayState,
  coreState: coreStore.CoreState,
  rootState: rootStoreReducers.State
}

export const appState = {
  gameplayState: gamePlayStore.gameplayState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
