import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { User, Category, Question, Game, SearchResults } from '../../../model';

import { user, authInitialized } from './user.reducer';
import { categories, getCategoryDictionary } from './categories.reducer';
import { tags } from './tags.reducer';
import { questionsSearchResults, unpublishedQuestions, questionOfTheDay, 
  questionSaveStatus, userPublishedQuestions, userUnpublishedQuestions } from './questions.reducer';
import { loginRedirectUrl } from './ui-state.reducer';
import { activeGames } from './game.reducer';

export * from './user.reducer';
export * from './categories.reducer';
export * from './tags.reducer';
export * from './questions.reducer';
export * from './ui-state.reducer';
export * from './game.reducer';
export * from './bulk-upload.reducer';

export interface CoreState {
  user: User;
  authInitialized: boolean;
  categories: Category[];
  tags: string[];
  questionsSearchResults: SearchResults;
  unpublishedQuestions: Question[];
  userPublishedQuestions: Question[];
  userUnpublishedQuestions: Question[];
  questionOfTheDay: Question;
  questionSaveStatus: string;
  loginRedirectUrl: string;
  activeGames: Game[];
}

export const reducer: ActionReducerMap<CoreState> = {
  user: user,
  authInitialized: authInitialized,
  categories: categories,
  tags: tags,
  questionsSearchResults: questionsSearchResults,
  unpublishedQuestions: unpublishedQuestions,
  userPublishedQuestions: userPublishedQuestions,
  userUnpublishedQuestions: userUnpublishedQuestions,
  questionOfTheDay: questionOfTheDay,
  questionSaveStatus: questionSaveStatus,
  loginRedirectUrl: loginRedirectUrl,
  activeGames: activeGames
};

//Features
export const coreState = createFeatureSelector<CoreState>('core');
