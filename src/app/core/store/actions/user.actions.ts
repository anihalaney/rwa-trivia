import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { User } from '../../../model';


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

  static LOAD_USER_INFO = 'LOAD_USER_INFO';
  loadUserInfo(userId: string): ActionWithPayload<string> {
    return {
      type: UserActions.LOAD_USER_INFO,
      payload: userId
    };
  }


  static LOAD_USER_INFO_SUCCESS = 'LOAD_USER_INFO_SUCCESS';
  loadUserInfoSuccess(user: User): ActionWithPayload<User> {
    return {
      type: UserActions.LOAD_USER_INFO_SUCCESS,
      payload: user
    };
  }

  static LOAD_USER_INFO_DICT_SUCCESS = 'LOAD_USER_INFO_DICT_SUCCESS';
  loadUserInfoDictSuccess(userDict: { [key: string]: User }): ActionWithPayload<{ [key: string]: User }> {
    return {
      type: UserActions.LOAD_USER_INFO_DICT_SUCCESS,
      payload: userDict
    };
  }

}
