import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchResults, Question } from '../../../model';
import { questionsSearchResults, unpublishedQuestions, getQuestionToggleStat } from './admin.reducer';
export * from './admin.reducer';

export interface AdminState {
    questionsSearchResults: SearchResults;
    unpublishedQuestions: Question[];
    getQuestionToggleStat: string;
}

export const reducer: ActionReducerMap<AdminState> = {
    questionsSearchResults: questionsSearchResults,
    unpublishedQuestions: unpublishedQuestions,
    getQuestionToggleStat: getQuestionToggleStat
};

export const adminState = createFeatureSelector<AdminState>('admin');
