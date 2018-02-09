import { User, Category, Question, Game, SearchResults } from '../../model';

import { user, authInitialized, categories, getCategoryDictionary, tags, //categoryDictionary,
         questionsSearchResults, unpublishedQuestions, questionOfTheDay, questionSaveStatus, 
         userPublishedQuestions, userUnpublishedQuestions,
         loginRedirectUrl, 
         activeGames } from './reducers';

import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { GamePlayState } from '../../game-play/store';

export interface AppStore {
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

export const reducer: ActionReducerMap<AppStore> = {
  user: user,
  authInitialized: authInitialized,
  categories: categories,
  //categoryDictionary: categoryDictionary,
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

export const getState = (state: AppStore) => state;

//Features
export const gameplayState = createFeatureSelector<GamePlayState>('gameplay');

//Categories selector
export const getCategories = createSelector(getState, (state: AppStore) => state.categories);
export const categoryDictionary = createSelector(getCategories, getCategoryDictionary);
