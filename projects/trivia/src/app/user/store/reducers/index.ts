import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { Question, User } from 'shared-library/shared/model';
import {
    userPublishedQuestions, userUnpublishedQuestions, checkDisplayName
} from './user.reducer';

export * from './user.reducer';

export interface UserState {
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    checkDisplayName: boolean;
}

export const reducer: ActionReducerMap<UserState> = {
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    checkDisplayName: checkDisplayName
};

export const userState = createFeatureSelector<UserState>('user');
