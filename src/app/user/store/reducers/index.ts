import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Question, Game } from '../../../model';
import { userProfileSaveStatus, userPublishedQuestions, userUnpublishedQuestions, questionSaveStatus, getGameResult } from './user.reducer';
import { Observable } from 'rxjs/Observable';

export * from './user.reducer';

export interface UserState {
    userProfileSaveStatus: String;
    userPublishedQuestions: Question[];
    userUnpublishedQuestions: Question[];
    questionSaveStatus: String;
    getGameResult: [Observable<Game[]>, Observable<Game[]>];
}

export const reducer: ActionReducerMap<UserState> = {
    userProfileSaveStatus: userProfileSaveStatus,
    userPublishedQuestions: userPublishedQuestions,
    userUnpublishedQuestions: userUnpublishedQuestions,
    questionSaveStatus: questionSaveStatus,
    getGameResult: getGameResult
};

export const userState = createFeatureSelector<UserState>('user');
