import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { User, Game, Friends, Invitation } from '../../../shared/model';

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
  addUserProfile(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.ADD_USER_PROFILE,
      payload: user
    };
  }

  static ADD_USER_PROFILE_SUCCESS = 'ADD_USER_PROFILE_SUCCESS';
  addUserProfileSuccess() {
    return {
      type: UserActions.ADD_USER_PROFILE_SUCCESS,
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
}
