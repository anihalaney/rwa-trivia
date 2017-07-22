import { User, Category, Question, Game } from '../../model';

import { user, categories, categoryDictionary, tags, 
         questions, unpublishedQuestions, sampleQuestions, questionSaveStatus, userQuestions,
         loginRedirectUrl, 
         currentGame, newGameId, currentGameQuestion, activeGames } from './reducers';

import { compose, ActionReducerMap } from '@ngrx/store';

export interface AppStore {
  user: User;
  categories: Category[];
  categoryDictionary: {[key: number]: Category};
  tags: string[];
  questions: Question[];
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
  questions: questions,
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
