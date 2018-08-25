import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from '../../../../shared-library/src/lib/core/store';

import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../game-play/store';
import * as userStore from '../user/store';
import * as bulkStore from '../bulk/store';
import * as leaderBoardStore from '../stats/store';
import * as coreStore from '../../../../shared-library/src/lib/core/store';
import * as socialStore from '../social/store';



//do we even need this?
export interface AppState {
  gameplayState: gamePlayStore.GamePlayState,
  userState: userStore.UserState,
  bulkState: bulkStore.BulkState,
  coreState: coreStore.CoreState,
  rootState: rootStoreReducers.State,
  leaderBoardState: leaderBoardStore.LeaderBoardState,
  socialState: socialStore.SocialState
}

export const appState = {
  gameplayState: gamePlayStore.gameplayState,
  userState: userStore.userState,
  bulkState: bulkStore.bulkState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState,
  leaderBoardState: leaderBoardStore.leaderBoardState,
  socialState: socialStore.socialState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;

