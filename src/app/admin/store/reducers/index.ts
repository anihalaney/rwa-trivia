import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchResults, Question } from '../../../model';
import { questionsSearchResults, unpublishedQuestions } from './admin.reducer';
export * from './admin.reducer';

export interface AdminState {
    questionsSearchResults: SearchResults;
    unpublishedQuestions: Question[];
}

export const reducer: ActionReducerMap<AdminState> = {
    questionsSearchResults: questionsSearchResults,
    unpublishedQuestions: unpublishedQuestions
};

export const adminState = createFeatureSelector<AdminState>('admin');