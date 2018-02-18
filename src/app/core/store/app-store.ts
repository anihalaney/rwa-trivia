import { User, Category, Question, Game, SearchResults, BulkUploadFileInfo } from '../../model';

import {
  user, authInitialized, categories, categoryDictionary, tags,
  questionsSearchResults, unpublishedQuestions, questionOfTheDay, questionSaveStatus,
  userPublishedQuestions, userUnpublishedQuestions,
  loginRedirectUrl,
  currentGame, newGameId, currentGameQuestion, activeGames, users, bulkUploadFileInfosById,
  bulkUploadFileInfos, userBulkUploadFileInfos, bulkUploadUnpublishedQuestions, bulkUploadPublishedQuestions
} from './reducers';

import { compose, ActionReducerMap } from '@ngrx/store';

export interface AppStore {
  user: User;
  authInitialized: boolean;
  categories: Category[];
  categoryDictionary: { [key: number]: Category };
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
  users: User[];
  bulkUploadFileInfos: BulkUploadFileInfo[];
  userBulkUploadFileInfos: BulkUploadFileInfo[];
  bulkUploadUnpublishedQuestions: Question[];
  bulkUploadPublishedQuestions: Question[];
  bulkUploadFileInfosById: BulkUploadFileInfo;
}

export const reducer: ActionReducerMap<AppStore> = {
  user: user,
  authInitialized: authInitialized,
  categories: categories,
  categoryDictionary: categoryDictionary,
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
  activeGames: activeGames,
  users:users,
  bulkUploadFileInfos: bulkUploadFileInfos,
  userBulkUploadFileInfos: userBulkUploadFileInfos,
  bulkUploadUnpublishedQuestions: bulkUploadUnpublishedQuestions,
  bulkUploadPublishedQuestions: bulkUploadPublishedQuestions,
  bulkUploadFileInfosById: bulkUploadFileInfosById
};
