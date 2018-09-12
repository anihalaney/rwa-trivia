import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { User } from '../../../shared/model';


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
}
