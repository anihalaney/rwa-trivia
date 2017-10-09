import { User, Category, Question, Game, SearchResults } from '../../model';

import { user, authInitialized, categories, categoryDictionary, tags, 
         questionsSearchResults, unpublishedQuestions, questionOfTheDay, questionSaveStatus, userQuestions,
         loginRedirectUrl, 
         currentGame, newGameId, currentGameQuestion, activeGames } from './reducers';

import { compose, ActionReducerMap } from '@ngrx/store';

export interface AppStore {
  user: User;
  authInitialized: boolean;
  categories: Category[];
  categoryDictionary: {[key: number]: Category};
  tags: string[];
  questionsSearchResults: SearchResults;
  unpublishedQuestions: Question[];
  userQuestions: Question[];
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
  categoryDictionary: categoryDictionary,
  tags: tags,
  questionsSearchResults: questionsSearchResults,
  unpublishedQuestions: unpublishedQuestions,
  userQuestions: userQuestions,
  questionOfTheDay: questionOfTheDay,
  questionSaveStatus: questionSaveStatus,
  loginRedirectUrl: loginRedirectUrl,
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  activeGames: activeGames
};
