import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question, Game, Friends } from '../../../../../../shared-library/src/public_api';
import {
    userProfileSaveStatus, userPublishedQuestions, userUnpublishedQuestions,
    questionSaveStatus, getGameResult, userFriends
} from './user.reducer';
import { Observable } from 'rxjs';


export * from './user.reducer';

export interface UserState {
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    questionSaveStatus: String;
    getGameResult: Game[];
    userFriends: Friends
}

export const reducer: ActionReducerMap<UserState> = {
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    questionSaveStatus: questionSaveStatus,
    getGameResult: getGameResult,
    userFriends: userFriends
};

export const userState = createFeatureSelector<UserState>('user');
