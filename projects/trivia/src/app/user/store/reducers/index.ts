import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question, Game, Friends } from 'shared-library/shared/model';
import {
    userProfileSaveStatus, userPublishedQuestions, userUnpublishedQuestions,
    getGameResult, userFriends
} from './user.reducer';
import { Observable } from 'rxjs';


export * from './user.reducer';

export interface UserState {
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    getGameResult: Game[];
    userFriends: Friends
}

export const reducer: ActionReducerMap<UserState> = {
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    getGameResult: getGameResult,
    userFriends: userFriends
};

export const userState = createFeatureSelector<UserState>('user');
