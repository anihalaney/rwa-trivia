import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { User, Category, Question, Game, Friends, Invitation, Account, Topic } from 'shared-library/shared/model';
import {
  user, authInitialized, invitationToken, userDict,
  gameInvites, userFriends, friendInvitations, userProfileSaveStatus, feedback, account, getGameResult, countries,
  addressUsingLongLat, addressSuggestions, userFriendInvitations, userUpdateStatus, firstQuestionBits, checkDisplayName
} from './user.reducer';
import { categories, topCategories } from './categories.reducer';
import { topTopics } from './topic.reducer';
import { tags, topTags } from './tags.reducer';
import { questionOfTheDay, questionSaveStatus, updateQuestion, firstQuestion, questionDraftSaveStatus, deleteQuestionImage } from './questions.reducer';
import { loginRedirectUrl, resetPasswordLogs } from './ui-state.reducer';
import {
  activeGames, newGameId, gameCreateStatus, updateUserReactionStatus, getUserReactionStatus,
  getQuestionSuccess, updateQuestionStatSuccess
} from './game.reducer';
import { applicationSettings } from './application-settings.reducer';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

export * from './user.reducer';
export * from './categories.reducer';
export * from './topic.reducer';
export * from './tags.reducer';
export * from './questions.reducer';
export * from './ui-state.reducer';
export * from './game.reducer';
export * from './application-settings.reducer';


export interface CoreState {
  user: User;
  userDict: { [key: string]: User };
  authInitialized: boolean;
  categories: Category[];
  topTopics: Topic[];
  tags: string[];
  questionOfTheDay: Question;
  loginRedirectUrl: string;
  questionSaveStatus: string;
  updateQuestion: string;
  activeGames: Game[];
  invitationToken: string;
  resetPasswordLogs: string[];
  gameInvites: Game[];
  userFriends: Friends;
  friendInvitations: Invitation[];
  newGameId: string;
  userProfileSaveStatus: String;
  feedback: String;
  applicationSettings: any[];
  account: Account;
  gameCreateStatus: String;
  getGameResult: Game[];
  countries: Country[];
  addressUsingLongLat: any;
  addressSuggestions: any;
  userFriendInvitations: { [key: string]: Invitation };
  userUpdateStatus: string;
  firstQuestionBits: any;
  firstQuestion: Question;
  questionDraftSaveStatus: any;
  updateUserReactionStatus: any;
  getUserReactionStatus: any;
  getQuestionSuccess: any;
  getTopCategories: any;
  getTopTags: any;
  checkDisplayName: boolean;
  updateQuestionStatSuccess: any;
  deleteQuestionImage: any;
}

export const reducer: ActionReducerMap<CoreState> = {
  user: user,
  userDict: userDict,
  authInitialized: authInitialized,
  categories: categories,
  tags: tags,
  topTopics: topTopics,
  questionOfTheDay: questionOfTheDay,
  questionSaveStatus: questionSaveStatus,
  questionDraftSaveStatus: questionDraftSaveStatus,
  loginRedirectUrl: loginRedirectUrl,
  activeGames: activeGames,
  updateQuestion: updateQuestion,
  invitationToken: invitationToken,
  resetPasswordLogs: resetPasswordLogs,
  gameInvites: gameInvites,
  userFriends: userFriends,
  friendInvitations: friendInvitations,
  newGameId: newGameId,
  userProfileSaveStatus: userProfileSaveStatus,
  feedback: feedback,
  applicationSettings: applicationSettings,
  account: account,
  gameCreateStatus: gameCreateStatus,
  getGameResult: getGameResult,
  countries: countries,
  addressUsingLongLat: addressUsingLongLat,
  addressSuggestions: addressSuggestions,
  userFriendInvitations: userFriendInvitations,
  userUpdateStatus: userUpdateStatus,
  firstQuestionBits: firstQuestionBits,
  firstQuestion: firstQuestion,
  updateUserReactionStatus: updateUserReactionStatus,
  getUserReactionStatus: getUserReactionStatus,
  getQuestionSuccess: getQuestionSuccess,
  getTopCategories: topCategories,
  getTopTags: topTags,
  checkDisplayName: checkDisplayName,
  updateQuestionStatSuccess: updateQuestionStatSuccess,
  deleteQuestionImage: deleteQuestionImage
};

// Features
export const coreState = createFeatureSelector<CoreState>('core');
