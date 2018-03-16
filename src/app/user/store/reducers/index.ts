import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question } from '../../../model';
import { userProfileSaveStatus, user, userPublishedQuestions, userUnpublishedQuestions, questionSaveStatus } from './user.reducer';

export * from './user.reducer';

export interface UserState {
    user: User
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    questionSaveStatus: String;
}

export const reducer: ActionReducerMap<UserState> = {
    user: user,
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
  userUnpublishedQuestions: userUnpublishedQuestions,
  questionSaveStatus: questionSaveStatus
};

export const userState = createFeatureSelector<UserState>('user');
