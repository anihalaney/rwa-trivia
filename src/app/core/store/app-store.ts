import { User, Category, Question, Game } from '../../model';

import { user, categories, categoryDictionary, tags, 
         questions, unpublishedQuestions, sampleQuestions, questionSaveStatus, userQuestions,
         loginRedirectUrl, 
         currentGame, newGameId, currentGameQuestion } from './reducers';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

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
}

export default compose(combineReducers)({
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
  currentGameQuestion: currentGameQuestion
});
