import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question } from '../../../model';
import {
    userProfileSaveStatus, userPublishedQuestions, userUnpublishedQuestions,
    questionSaveStatus
} from './user.reducer';

export * from './user.reducer';

export interface UserState {
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    questionSaveStatus: String;
}

export const reducer: ActionReducerMap<UserState> = {
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    questionSaveStatus: questionSaveStatus
};

export const userState = createFeatureSelector<UserState>('user');
