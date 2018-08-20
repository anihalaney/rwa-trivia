import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { User, Category, Question, Game } from '../../../../../../shared-library/src/public_api';
import { user, authInitialized, userDict } from './user.reducer';
import { categories } from './categories.reducer';
import { tags } from './tags.reducer';

import { loginRedirectUrl } from './ui-state.reducer';
import { Observable } from 'rxjs';

export * from './user.reducer';
export * from './categories.reducer';
export * from './tags.reducer';
export * from './ui-state.reducer';



export interface CoreState {
  user: User;
  userDict: { [key: string]: User };
  authInitialized: boolean;
  categories: Category[];
  tags: string[];
  loginRedirectUrl: string;
}

export const reducer: ActionReducerMap<CoreState> = {
  user: user,
  userDict: userDict,
  authInitialized: authInitialized,
  categories: categories,
  tags: tags,
  loginRedirectUrl: loginRedirectUrl
};

// Features
export const coreState = createFeatureSelector<CoreState>('core');
