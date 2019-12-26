import * as rootStoreReducers from './reducers';
import * as gamePlayStore from '../game-play/store';
import * as userStore from '../user/store';
import * as bulkStore from '../bulk/store';
import * as coreStore from 'shared-library/core/store';
import * as dashboardStore from '../dashboard/store';



// do we even need this?
export interface AppState {
  gamePlayState: gamePlayStore.GamePlayState;
  userState: userStore.UserState;
  bulkState: bulkStore.BulkState;
  coreState: coreStore.CoreState;
  rootState: rootStoreReducers.State;
  dashboardState: dashboardStore.DashboardState;
}

export const appState = {
  gamePlayState: gamePlayStore.gamePlayState,
  userState: userStore.userState,
  bulkState: bulkStore.bulkState,
  coreState: coreStore.coreState,
  rootState: rootStoreReducers.rootState,
  dashboardState: dashboardStore.dashboardState
};


// Selectors from coreStore
// TODO: a good way to slice this when there are multiple feature stores??
export const getCategories = coreStore.getCategories;
export const categoryDictionary = coreStore.categoryDictionary;
export const getTags = coreStore.getTags;
export const getTopics = coreStore.getTopics;
export const topicDictionary = coreStore.topicDictionary;

