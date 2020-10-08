import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { Question } from 'shared-library/shared/model';
import {
    userPublishedQuestions, userUnpublishedQuestions
} from './user.reducer';

export * from './user.reducer';

export interface UserState {
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
}

export const reducer: ActionReducerMap<UserState> = {
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
};

export const userState = createFeatureSelector<UserState>('user');
