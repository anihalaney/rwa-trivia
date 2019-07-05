import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { User, Category, Question, Game, Friends, Invitation, Account } from 'shared-library/shared/model';
import {
  user, authInitialized, invitationToken, userDict,
  gameInvites, userFriends, friendInvitations, userProfileSaveStatus, feedback, account, getGameResult, countries,
  addressUsingLongLat, addressSuggestions, userFriendInvitations
} from './user.reducer';
import { categories } from './categories.reducer';
import { tags } from './tags.reducer';
import { questionOfTheDay, questionSaveStatus, updateQuestion } from './questions.reducer';
import { loginRedirectUrl, resetPasswordLogs } from './ui-state.reducer';
import { activeGames, newGameId, gameCreateStatus } from './game.reducer';
import { applicationSettings } from './application-settings.reducer';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

export * from './user.reducer';
export * from './categories.reducer';
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
}

export const reducer: ActionReducerMap<CoreState> = {
  user: user,
  userDict: userDict,
  authInitialized: authInitialized,
  categories: categories,
  tags: tags,
  questionOfTheDay: questionOfTheDay,
  questionSaveStatus: questionSaveStatus,
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
  addressSuggestions: addressSuggestions
  userFriendInvitations: userFriendInvitations
};

// Features
export const coreState = createFeatureSelector<CoreState>('core');
