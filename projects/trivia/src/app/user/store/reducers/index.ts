import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question, Game, Friends, Invitation } from 'shared-library/shared/model';
import {
     userPublishedQuestions, userUnpublishedQuestions,
    getGameResult,
} from './user.reducer';
import { Observable } from 'rxjs';


export * from './user.reducer';

export interface UserState {
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    getGameResult: Game[];
}

export const reducer: ActionReducerMap<UserState> = {
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    getGameResult: getGameResult,
};

export const userState = createFeatureSelector<UserState>('user');
