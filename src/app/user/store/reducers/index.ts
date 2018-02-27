import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User } from '../../../model';
import { userProfileSaveStatus, user } from './user.reducer';

export * from './user.reducer';

export interface UserState {
    user: User
    userProfileSaveStatus: String;
}

export const reducer: ActionReducerMap<UserState> = {
    user: user,
    userProfileSaveStatus: userProfileSaveStatus
};

export const userState = createFeatureSelector<UserState>('user');
