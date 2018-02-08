import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {ActionWithPayload} from './action-with-payload';

import {User} from '../../../model';

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

  static LOAD_USERS = 'LOAD_USERS';
  loadUsers(): ActionWithPayload<null> {
    return {
      type: UserActions.LOAD_USERS,
      payload: null
    };
  }

  static LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';
  loadUsersSuccess(user: User[]): ActionWithPayload<User[]> {
    return {
      type: UserActions.LOAD_USERS_SUCCESS,
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

  static UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
  updateUserSuccess(): ActionWithPayload<null> {
    return {
      type: UserActions.UPDATE_USER_SUCCESS,
      payload: null
    };
  }
}
