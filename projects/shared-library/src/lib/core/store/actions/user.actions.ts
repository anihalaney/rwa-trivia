import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { User, Game, Friends, Invitation } from '../../../shared/model';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

@Injectable()
export class UserActions {

  static LOGOFF = 'LOGOFF';
  logoff(): ActionWithPayload<null> {
    return {
      type: UserActions.LOGOFF,
      payload: null
    };
  }

  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  loginSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOGIN_SUCCESS,
      payload: user
    };
  }


  static ADD_USER_WITH_ROLES = 'ADD_USER_WITH_ROLES';
  addUserWithRoles(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.ADD_USER_WITH_ROLES,
      payload: user
    };
  }

  static LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';
  loadAccountsSuccess(account: any): ActionWithPayload<any> {
    return {
      type: UserActions.LOAD_ACCOUNT_SUCCESS,
      payload: account
    };
  }

  static STORE_INVITATION_TOKEN = 'STORE_INVITATION_TOKEN';
  storeInvitationToken(token: string): ActionWithPayload<string> {
    return {
      type: UserActions.STORE_INVITATION_TOKEN,
      payload: token
    };
  }

  static LOAD_OTHER_USER_PROFILE = 'LOAD_OTHER_USER_PROFILE';
  loadOtherUserProfile(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE,
      payload: userId
    };
  }


  static LOAD_OTHER_USER_PROFILE_SUCCESS = 'LOAD_OTHER_USER_PROFILE_SUCCESS';
  loadOtherUserProfileSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS,
      payload: user
    };
  }


  static LOAD_OTHER_USER_EXTEDED_INFO = 'LOAD_OTHER_USER_EXTEDED_INFO';
  loadOtherUserExtendedInfo(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_OTHER_USER_EXTEDED_INFO,
      payload: userId
    };
  }

  static LOAD_OTHER_USER_FRIEND_EXTEDED_INFO = 'LOAD_OTHER_USER_FRIEND_EXTEDED_INFO';
  loadOtherUserFriendExtendedInfo(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_OTHER_USER_FRIEND_EXTEDED_INFO,
      payload: userId
    };
  }

  static LOAD_USER_INVITATIONS_INFO = 'LOAD_USER_INVITATIONS_INFO';
  loadUserInvitationsInfo(userId: string, invitedUserEmail: string, invitedUserId: string): ActionWithPayload<{}> {
    return {
      type: UserActions.LOAD_USER_INVITATIONS_INFO,
      payload: { userId, invitedUserEmail, invitedUserId }
    };
  }

  static LOAD_USER_INVITATION_INFO_SUCCESS = 'LOAD_USER_INVITATION_INFO_SUCCESS';
  loadUserInvitationsInfoSuccess(invitation: Invitation): ActionWithPayload<Invitation> {
    return {
      type: UserActions.LOAD_USER_INVITATION_INFO_SUCCESS,
      payload: invitation
    };
  }

  static LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS = 'LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS';
  loadOtherUserProfileWithExtendedInfoSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS,
      payload: user
    };
  }

  static UPDATE_USER = 'UPDATE_USER';
  updateUser(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.UPDATE_USER,
      payload: user
    };
  }

  static LOAD_GAME_INVITES = 'LOAD_GAME_INVITES';
  loadGameInvites(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_GAME_INVITES,
      payload: user
    };
  }

  static LOAD_GAME_INVITES_SUCCESS = 'LOAD_GAME_INVITES_SUCCESS';
  loadGameInvitesSuccess(games: Game[]): ActionWithPayload<Game[]> {
    return {
      type: UserActions.LOAD_GAME_INVITES_SUCCESS,
      payload: games
    };
  }

  static REJECT_GAME_INVITATION = 'REJECT_GAME_INVITATION';
  rejectGameInvitation(payload: string): ActionWithPayload<string> {
    return {
      type: UserActions.REJECT_GAME_INVITATION,
      payload: payload
    };
  }

  static UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS';
  updateGameSuccess(): ActionWithPayload<string> {
    return {
      type: UserActions.UPDATE_GAME_SUCCESS,
      payload: ''
    };
  }

  static LOAD_USER_FRIENDS = 'LOAD_USER_FRIENDS';
  loadUserFriends(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_USER_FRIENDS,
      payload: userId
    };
  }

  static LOAD_USER_FRIENDS_SUCCESS = 'LOAD_USER_FRIENDS_SUCCESS';
  loadUserFriendsSuccess(friends: Friends): ActionWithPayload<Friends> {
    return {
      type: UserActions.LOAD_USER_FRIENDS_SUCCESS,
      payload: friends
    };
  }

  static LOAD_FRIEND_INVITATION_SUCCESS = 'LOAD_FRIEND_INVITATION_SUCCESS';
  loadUserInvitationsSuccess(invitation: Invitation[]): ActionWithPayload<Invitation[]> {
    return {
      type: UserActions.LOAD_FRIEND_INVITATION_SUCCESS,
      payload: invitation
    };
  }

  static UPDATE_INVITATION = 'UPDATE_INVITATION';
  updateInvitation(invitation: Invitation): ActionWithPayload<Invitation> {
    return {
      type: UserActions.UPDATE_INVITATION,
      payload: invitation
    };
  }

  static MAKE_FRIEND = 'MAKE_FRIEND';
  makeFriend(makeFriend): ActionWithPayload<String> {
    return {
      type: UserActions.MAKE_FRIEND,
      payload: makeFriend
    };
  }

  static MAKE_FRIEND_SUCCESS = 'MAKE_FRIEND_SUCCESS';
  makeFriendSuccess() {
    return {
      type: UserActions.MAKE_FRIEND_SUCCESS,
      payload: null
    };
  }

  static ADD_USER_INVITATION = 'ADD_USER_INVITATION';
  addUserInvitation(data): ActionWithPayload<any> {
    return {
      type: UserActions.ADD_USER_INVITATION,
      payload: data
    };
  }

  static ADD_USER_INVITATION_SUCCESS = 'ADD_USER_INVITATION_SUCCESS';
  addUserInvitationSuccess(addUserInvitationSuccess): ActionWithPayload<string> {
    return {
      type: UserActions.ADD_USER_INVITATION_SUCCESS,
      payload: addUserInvitationSuccess
    };
  }

  static ADD_USER_PROFILE = 'ADD_USER_PROFILE';
  addUserProfile(user: User, isLocationChanged: boolean): ActionWithPayload<any> {
    return {
      type: UserActions.ADD_USER_PROFILE,
      payload: { user: user, isLocationChanged: isLocationChanged }
    };
  }

  static ADD_FEEDBACK = 'ADD_FEEDBACK';
  addFeedback(feedback): ActionWithPayload<User> {
    return {
      type: UserActions.ADD_FEEDBACK,
      payload: feedback
    };
  }

  static GET_COUNTRIES = 'GET_COUNTRIES';
  getCountries(): ActionWithPayload<Country> {
    return {
      type: UserActions.GET_COUNTRIES,
      payload: null
    };
  }

  static LOAD_COUNTRIES_SUCCESS = 'LOAD_COUNTRIES_SUCCESS';
  loadCountriesSuccess(countries: Country[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_COUNTRIES_SUCCESS,
      payload: countries
    };
  }

  static ADD_USER_PROFILE_SUCCESS = 'ADD_USER_PROFILE_SUCCESS';
  addUserProfileSuccess() {
    return {
      type: UserActions.ADD_USER_PROFILE_SUCCESS,
      payload: null
    };
  }

  static ADD_FEEDBACK_SUCCESS = 'ADD_FEEDBACK_SUCCESS';
  addFeedbackSuccess() {
    return {
      type: UserActions.ADD_FEEDBACK_SUCCESS,
      payload: null
    };
  }

  static ADD_USER_LIVES = 'UPDATE_ADD_USER_LIVESUSER';
  addUserLives(userId: String): ActionWithPayload<String> {
    return {
      type: UserActions.ADD_USER_LIVES,
      payload: userId
    };
  }

  static ADD_USER_LIVES_SUCCESS = 'ADD_USER_LIVES_SUCCESS';
  addUserLivesSuccess() {
    return {
      type: UserActions.ADD_USER_LIVES_SUCCESS,
      payload: null
    };
  }

  static GET_GAME_RESULT = 'GET_GAME_RESULT';
  getGameResult(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.GET_GAME_RESULT,
      payload: user
    };
  }

  static GET_GAME_RESULT_SUCCESS = 'GET_GAME_RESULT_SUCCESS';
  getGameResultSuccess(games: Game[]): ActionWithPayload<Game[]> {
    return {
      type: UserActions.GET_GAME_RESULT_SUCCESS,
      payload: games
    };
  }

  static LOAD_ADDRESS_USING_LAT_LONG = 'LOAD_ADDRESS_USING_LAT_LONG';
  loadAddressUsingLatLong(latLong: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_ADDRESS_USING_LAT_LONG,
      payload: latLong
    };
  }

  static LOAD_ADDRESS_USING_LAT_LONG_SUCCESS = 'LOAD_ADDRESS_USING_LAT_LONG_SUCCESS';
  loadAddressUsingLatLongSuccess(location: any[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_ADDRESS_USING_LAT_LONG_SUCCESS,
      payload: location
    };
  }

  static LOAD_ADDRESS_SUGGESTIONS = 'LOAD_ADDRESS_SUGGESTIONS';
  loadAddressSuggestions(location: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_ADDRESS_SUGGESTIONS,
      payload: location
    };
  }

  static LOAD_ADDRESS_SUGGESTIONS_SUCCESS = 'LOAD_ADDRESS_SUGGESTIONS_SUCCESS';
  loadAddressSuggestionsSuccess(suggestions: any[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_ADDRESS_SUGGESTIONS_SUCCESS,
      payload: suggestions
    };
  }

  static SET_FIRST_QUESTION_BITS = 'SET_FIRST_QUESTION_BITS';
  setFirstQuestionBits(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.SET_FIRST_QUESTION_BITS,
      payload: userId
    };
  }

  static SET_FIRST_QUESTION_BITS_SUCCESS = 'SET_FIRST_QUESTION_BITS_SUCCESS';
  setFirstQuestionBitsSuccess(msg: string): ActionWithPayload<string> {
    return {
      type: UserActions.SET_FIRST_QUESTION_BITS_SUCCESS,
      payload: msg
    };
  }

}
