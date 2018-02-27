import { User, Category, Question, Game, SearchResults, BulkUploadFileInfo } from '../../model';

import {
  user, authInitialized, categories,  tags,
  questionsSearchResults, unpublishedQuestions, questionOfTheDay, questionSaveStatus,
  userPublishedQuestions, userUnpublishedQuestions,
  loginRedirectUrl,
   activeGames, bulkUploadFileInfosById,
  bulkUploadFileInfos, userBulkUploadFileInfos,
  bulkUploadUnpublishedQuestions, bulkUploadPublishedQuestions,
  userProfileSaveStatus
} from './reducers';

import { compose, ActionReducerMap } from '@ngrx/store';
import { AppState } from 'app/store';

export interface AppStore {
  user: User;
  userProfileSaveStatus: string,
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
  bulkUploadFileInfos: BulkUploadFileInfo[];
  userBulkUploadFileInfos: BulkUploadFileInfo[];
  bulkUploadUnpublishedQuestions: Question[];
  bulkUploadPublishedQuestions: Question[];
  bulkUploadFileInfosById: BulkUploadFileInfo;
}

export const reducer: any = {
  user: user,
  userProfileSaveStatus: userProfileSaveStatus,
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
  activeGames: activeGames,
  bulkUploadFileInfos: bulkUploadFileInfos,
  userBulkUploadFileInfos: userBulkUploadFileInfos,
  bulkUploadUnpublishedQuestions: bulkUploadUnpublishedQuestions,
  bulkUploadPublishedQuestions: bulkUploadPublishedQuestions,
  bulkUploadFileInfosById: bulkUploadFileInfosById,
};
