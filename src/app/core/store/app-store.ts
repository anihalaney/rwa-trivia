import { User, Category, Question, Game, SearchResults } from '../../model';

import { user, categories, categoryDictionary, tags, 
         questionsSearchResults, unpublishedQuestions, sampleQuestions, questionSaveStatus, userQuestions,
         loginRedirectUrl, 
         currentGame, newGameId, currentGameQuestion, activeGames } from './reducers';

import { compose, ActionReducerMap } from '@ngrx/store';

export interface AppStore {
  user: User;
  categories: Category[];
  categoryDictionary: {[key: number]: Category};
  tags: string[];
  questionsSearchResults: SearchResults;
  unpublishedQuestions: Question[];
  userQuestions: Question[];
  sampleQuestions: Question[];
  questionSaveStatus: string;
  loginRedirectUrl: string;
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question;
  activeGames: string[];
}

export const reducer: ActionReducerMap<AppStore> = {
  user: user,
  categories: categories,
  categoryDictionary: categoryDictionary,
  tags: tags,
  questionsSearchResults: questionsSearchResults,
  unpublishedQuestions: unpublishedQuestions,
  userQuestions: userQuestions,
  sampleQuestions: sampleQuestions,
  questionSaveStatus: questionSaveStatus,
  loginRedirectUrl: loginRedirectUrl,
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  activeGames: activeGames
};
