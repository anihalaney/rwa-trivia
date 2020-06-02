import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { User, Game, Friend, Invitation } from '../../../shared/model';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

@Injectable()
export class UserActions {

  static LOGOFF = 'LOGOFF';

  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';


  static ADD_USER_WITH_ROLES = 'ADD_USER_WITH_ROLES';

  static LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

  static STORE_INVITATION_TOKEN = 'STORE_INVITATION_TOKEN';

  static LOAD_OTHER_USER_PROFILE = 'LOAD_OTHER_USER_PROFILE';


  static LOAD_OTHER_USER_PROFILE_SUCCESS = 'LOAD_OTHER_USER_PROFILE_SUCCESS';


  static LOAD_OTHER_USER_EXTEDED_INFO = 'LOAD_OTHER_USER_EXTEDED_INFO';

  static LOAD_USER_INVITATIONS_INFO = 'LOAD_USER_INVITATIONS_INFO';

  static LOAD_USER_INVITATION_INFO_SUCCESS = 'LOAD_USER_INVITATION_INFO_SUCCESS';

  static LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS = 'LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS';

  static UPDATE_USER = 'UPDATE_USER';

  static LOAD_GAME_INVITES = 'LOAD_GAME_INVITES';

  static LOAD_GAME_INVITES_SUCCESS = 'LOAD_GAME_INVITES_SUCCESS';

  static REJECT_GAME_INVITATION = 'REJECT_GAME_INVITATION';

  static UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS';

  static LOAD_USER_FRIENDS = 'LOAD_USER_FRIENDS';

  static LOAD_USER_FRIENDS_SUCCESS = 'LOAD_USER_FRIENDS_SUCCESS';

  static LOAD_FRIEND_INVITATION_SUCCESS = 'LOAD_FRIEND_INVITATION_SUCCESS';

  static UPDATE_INVITATION = 'UPDATE_INVITATION';

  static MAKE_FRIEND = 'MAKE_FRIEND';

  static MAKE_FRIEND_SUCCESS = 'MAKE_FRIEND_SUCCESS';

  static ADD_USER_INVITATION = 'ADD_USER_INVITATION';

  static ADD_USER_INVITATION_SUCCESS = 'ADD_USER_INVITATION_SUCCESS';

  static ADD_USER_PROFILE = 'ADD_USER_PROFILE';

  static ADD_FEEDBACK = 'ADD_FEEDBACK';

  static GET_COUNTRIES = 'GET_COUNTRIES';

  static LOAD_COUNTRIES_SUCCESS = 'LOAD_COUNTRIES_SUCCESS';

  static ADD_USER_PROFILE_SUCCESS = 'ADD_USER_PROFILE_SUCCESS';

  static ADD_FEEDBACK_SUCCESS = 'ADD_FEEDBACK_SUCCESS';

  static ADD_USER_LIVES = 'UPDATE_ADD_USER_LIVESUSER';

  static ADD_USER_LIVES_SUCCESS = 'ADD_USER_LIVES_SUCCESS';

  static GET_GAME_RESULT = 'GET_GAME_RESULT';

  static GET_GAME_RESULT_SUCCESS = 'GET_GAME_RESULT_SUCCESS';

  static LOAD_ADDRESS_USING_LAT_LONG = 'LOAD_ADDRESS_USING_LAT_LONG';

  static LOAD_ADDRESS_USING_LAT_LONG_SUCCESS = 'LOAD_ADDRESS_USING_LAT_LONG_SUCCESS';

  static LOAD_ADDRESS_SUGGESTIONS = 'LOAD_ADDRESS_SUGGESTIONS';

  static LOAD_ADDRESS_SUGGESTIONS_SUCCESS = 'LOAD_ADDRESS_SUGGESTIONS_SUCCESS';

  static CHECK_DISPLAY_NAME = 'CHECK_DISPLAY_NAME';

  static CHECK_DISPLAY_NAME_SUCCESS = 'CHECK_DISPLAY_NAME_SUCCESS';

  static UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

  static SET_FIRST_QUESTION_BITS = 'SET_FIRST_QUESTION_BITS';

  static SET_FIRST_QUESTION_BITS_SUCCESS = 'SET_FIRST_QUESTION_BITS_SUCCESS';

  logoff(): ActionWithPayload<any> {
    return {
      type: UserActions.LOGOFF,
      payload: null
    };
  }
  loginSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOGIN_SUCCESS,
      payload: user
    };
  }
  addUserWithRoles(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.ADD_USER_WITH_ROLES,
      payload: user
    };
  }
  loadAccountsSuccess(account: any): ActionWithPayload<any> {
    return {
      type: UserActions.LOAD_ACCOUNT_SUCCESS,
      payload: account
    };
  }
  storeInvitationToken(token: string): ActionWithPayload<string> {
    return {
      type: UserActions.STORE_INVITATION_TOKEN,
      payload: token
    };
  }
  loadOtherUserProfile(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE,
      payload: userId
    };
  }
  loadOtherUserProfileSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS,
      payload: user
    };
  }
  loadOtherUserExtendedInfo(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_OTHER_USER_EXTEDED_INFO,
      payload: userId
    };
  }
  loadUserInvitationsInfo(userId: string, invitedUserEmail: string, invitedUserId: string): ActionWithPayload<{}> {
    return {
      type: UserActions.LOAD_USER_INVITATIONS_INFO,
      payload: { userId, invitedUserEmail, invitedUserId }
    };
  }
  loadUserInvitationsInfoSuccess(invitation: Invitation): ActionWithPayload<Invitation> {
    return {
      type: UserActions.LOAD_USER_INVITATION_INFO_SUCCESS,
      payload: invitation
    };
  }
  loadOtherUserProfileWithExtendedInfoSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS,
      payload: user
    };
  }
  updateUser(user: User, status: any): ActionWithPayload<any> {
    return {
      type: UserActions.UPDATE_USER,
      payload: { user, status }
    };
  }
  updateUserSuccess(status: string): ActionWithPayload<string> {
    return {
      type: UserActions.UPDATE_USER_SUCCESS,
      payload: status
    };
  }
  loadGameInvites(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_GAME_INVITES,
      payload: user
    };
  }
  loadGameInvitesSuccess(games: Game[]): ActionWithPayload<Game[]> {
    return {
      type: UserActions.LOAD_GAME_INVITES_SUCCESS,
      payload: games
    };
  }
  rejectGameInvitation(payload: string): ActionWithPayload<string> {
    return {
      type: UserActions.REJECT_GAME_INVITATION,
      payload: payload
    };
  }
  updateGameSuccess(): ActionWithPayload<string> {
    return {
      type: UserActions.UPDATE_GAME_SUCCESS,
      payload: ''
    };
  }
  loadUserFriends(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_USER_FRIENDS,
      payload: userId
    };
  }
  loadUserFriendsSuccess(friends: Friend[]): ActionWithPayload<Friend[]> {
    return {
      type: UserActions.LOAD_USER_FRIENDS_SUCCESS,
      payload: friends
    };
  }
  loadUserInvitationsSuccess(invitation: Invitation[]): ActionWithPayload<Invitation[]> {
    
    return {
      type: UserActions.LOAD_FRIEND_INVITATION_SUCCESS,
      payload: invitation
    };
  }
  updateInvitation(invitation: Invitation): ActionWithPayload<Invitation> {
    return {
      type: UserActions.UPDATE_INVITATION,
      payload: invitation
    };
  }
  makeFriend(makeFriend): ActionWithPayload<String> {
    return {
      type: UserActions.MAKE_FRIEND,
      payload: makeFriend
    };
  }
  makeFriendSuccess() {
    return {
      type: UserActions.MAKE_FRIEND_SUCCESS,
      payload: null
    };
  }
  addUserInvitation(data): ActionWithPayload<any> {
    return {
      type: UserActions.ADD_USER_INVITATION,
      payload: data
    };
  }
  addUserInvitationSuccess(addUserInvitationSuccess): ActionWithPayload<string> {
    return {
      type: UserActions.ADD_USER_INVITATION_SUCCESS,
      payload: addUserInvitationSuccess
    };
  }
  addUserProfile(user: User, isLocationChanged: boolean): ActionWithPayload<any> {
    return {
      type: UserActions.ADD_USER_PROFILE,
      payload: { user: user, isLocationChanged: isLocationChanged }
    };
  }
  addFeedback(feedback): ActionWithPayload<User> {
    return {
      type: UserActions.ADD_FEEDBACK,
      payload: feedback
    };
  }
  getCountries(): ActionWithPayload<Country> {
    return {
      type: UserActions.GET_COUNTRIES,
      payload: null
    };
  }
  loadCountriesSuccess(countries: Country[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_COUNTRIES_SUCCESS,
      payload: countries
    };
  }
  addUserProfileSuccess() {
    return {
      type: UserActions.ADD_USER_PROFILE_SUCCESS,
      payload: null
    };
  }
  addFeedbackSuccess() {
    return {
      type: UserActions.ADD_FEEDBACK_SUCCESS,
      payload: null
    };
  }
  addUserLives(userId: String): ActionWithPayload<String> {
    return {
      type: UserActions.ADD_USER_LIVES,
      payload: userId
    };
  }
  addUserLivesSuccess() {
    return {
      type: UserActions.ADD_USER_LIVES_SUCCESS,
      payload: null
    };
  }
  getGameResult(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.GET_GAME_RESULT,
      payload: user
    };
  }
  getGameResultSuccess(games: Game[]): ActionWithPayload<Game[]> {
    return {
      type: UserActions.GET_GAME_RESULT_SUCCESS,
      payload: games
    };
  }
  loadAddressUsingLatLong(latLong: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_ADDRESS_USING_LAT_LONG,
      payload: latLong
    };
  }
  loadAddressUsingLatLongSuccess(location: any[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_ADDRESS_USING_LAT_LONG_SUCCESS,
      payload: location
    };
  }
  loadAddressSuggestions(location: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_ADDRESS_SUGGESTIONS,
      payload: location
    };
  }
  loadAddressSuggestionsSuccess(suggestions: any[]): ActionWithPayload<any[]> {
    return {
      type: UserActions.LOAD_ADDRESS_SUGGESTIONS_SUCCESS,
      payload: suggestions
    };
  }

  checkDisplayName(name: string): ActionWithPayload<any> {
    return {
      type: UserActions.CHECK_DISPLAY_NAME,
      payload: name
    };
  }

  checkDisplayNameSuccess(result: boolean): ActionWithPayload<any> {
    return {
      type: UserActions.CHECK_DISPLAY_NAME_SUCCESS,
      payload: result
    };
  }
  setFirstQuestionBits(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.SET_FIRST_QUESTION_BITS,
      payload: userId
    };
  }
  setFirstQuestionBitsSuccess(msg: string): ActionWithPayload<string> {
    return {
      type: UserActions.SET_FIRST_QUESTION_BITS_SUCCESS,
      payload: msg
    };
  }

}
