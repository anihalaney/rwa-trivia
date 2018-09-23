import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { SearchResults, Question } from '../../../../../../shared-library/src/public_api';
import { questionsSearchResults, unpublishedQuestions, getQuestionToggleState, getArchiveToggleState } from './admin.reducer';
export * from './admin.reducer';

export interface AdminState {
    questionsSearchResults: SearchResults;
    unpublishedQuestions: Question[];
    getQuestionToggleState: string;
    getArchiveToggleState: boolean;
}

export const reducer: ActionReducerMap<AdminState> = {
    questionsSearchResults: questionsSearchResults,
    unpublishedQuestions: unpublishedQuestions,
    getQuestionToggleState: getQuestionToggleState,
    getArchiveToggleState: getArchiveToggleState
};

export const adminState = createFeatureSelector<AdminState>('admin');
