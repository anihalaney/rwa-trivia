import { User, Category, Question, Game, SearchResults } from '../../model';

import { user, authInitialized, categories, getCategoryDictionary, tags, //categoryDictionary,
         questionsSearchResults, unpublishedQuestions, questionOfTheDay, questionSaveStatus, 
         userPublishedQuestions, userUnpublishedQuestions,
         loginRedirectUrl, 
         currentGame, newGameId, currentGameQuestion, activeGames } from './reducers';

import { ActionReducerMap, createSelector } from '@ngrx/store';

export interface AppStore {
  user: User;
  authInitialized: boolean;
  categories: Category[];
  //categoryDictionary: {[key: number]: Category};
  tags: string[];
  questionsSearchResults: SearchResults;
  unpublishedQuestions: Question[];
  userPublishedQuestions: Question[];
  userUnpublishedQuestions: Question[];
  questionOfTheDay: Question;
  questionSaveStatus: string;
  loginRedirectUrl: string;
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question;
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
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  activeGames: activeGames
};

export const getState = (state: AppStore) => state;

//Categories selector
export const getCategories = createSelector(getState, (state: AppStore) => state.categories);
export const categoryDictionary = createSelector(getCategories, getCategoryDictionary);
