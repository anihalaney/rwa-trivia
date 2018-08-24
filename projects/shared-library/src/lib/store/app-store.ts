import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { getCategoryDictionary } from '../core/store';

import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../../../../trivia/src/app/game-play/store';
import * as userStore from '../../../../trivia/src/app/user/store';
import * as bulkStore from '../../../../trivia/src/app/bulk/store';
import * as leaderBoardStore from '../../../../trivia/src/app/stats/store';
import * as coreStore from '../core/store';
import * as socialStore from '../../../../trivia/src/app/social/store';
import * as adminStore from '../../../../trivia-admin/src/app/admin/store';
import { adminState } from '../../../../trivia-admin/src/app/admin/store';

//do we even need this?
export interface AppState {
  gameplayState: gamePlayStore.GamePlayState,
  userState: userStore.UserState,
  bulkState: bulkStore.BulkState,
  coreState: coreStore.CoreState,
  rootState: rootStoreReducers.State,
  leaderBoardState: leaderBoardStore.LeaderBoardState,
  socialState: socialStore.SocialState
  adminState: adminStore.AdminState
}

export const appState = {
  gameplayState: gamePlayStore.gameplayState,
  userState: userStore.userState,
  bulkState: bulkStore.bulkState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState,
  leaderBoardState: leaderBoardStore.leaderBoardState,
  socialState: socialStore.socialState,
  adminState: adminStore.adminState
};


//Selectors from coreStore
//TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;

