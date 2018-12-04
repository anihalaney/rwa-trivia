import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question, Game, Friends, Invitation } from 'shared-library/shared/model';
import {
    userProfileSaveStatus, userPublishedQuestions, userUnpublishedQuestions,
    getGameResult, friendInvitations
} from './user.reducer';
import { Observable } from 'rxjs';


export * from './user.reducer';

export interface UserState {
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    getGameResult: Game[];
    friendInvitations: Invitation[];
}

export const reducer: ActionReducerMap<UserState> = {
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    getGameResult: getGameResult,
    friendInvitations: friendInvitations
};

export const userState = createFeatureSelector<UserState>('user');
