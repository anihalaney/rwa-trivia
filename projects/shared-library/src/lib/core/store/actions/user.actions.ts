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
  LoadUserInvitationsSuccess(invitation: Invitation[]): ActionWithPayload<Invitation[]> {
    return {
      type: UserActions.LOAD_FRIEND_INVITATION_SUCCESS,
      payload: invitation
    };
  }

  static UPDATE_INVITATION = 'UPDATE_INVITATION';
  UpdateInvitation(invitation: Invitation[]): ActionWithPayload<Invitation[]> {
    return {
      type: UserActions.UPDATE_INVITATION,
      payload: invitation
    };
  }

}
