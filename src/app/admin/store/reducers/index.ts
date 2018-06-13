import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchResults, Question } from '../../../model';
import { questionsSearchResults, unpublishedQuestions, getQuestionToggleStat, getArchiveToggleState } from './admin.reducer';
export * from './admin.reducer';

export interface AdminState {
    questionsSearchResults: SearchResults;
    unpublishedQuestions: Question[];
    getQuestionToggleStat: string;
    getArchiveToggleState: boolean;
}

export const reducer: ActionReducerMap<AdminState> = {
    questionsSearchResults: questionsSearchResults,
    unpublishedQuestions: unpublishedQuestions,
    getQuestionToggleStat: getQuestionToggleStat,
    getArchiveToggleState: getArchiveToggleState
};

export const adminState = createFeatureSelector<AdminState>('admin');
