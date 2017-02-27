import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import {User} from '../../model';

@Injectable()
export class UserActions {

  static LOGOFF = 'LOGOFF';
  logoff(): Action {
    return {
      type: UserActions.LOGOFF,
      payload: null
    };
  }

  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  loginSuccess(user: User): Action {
    return {
      type: UserActions.LOGIN_SUCCESS,
      payload: user
    };
  }

  static ADD_USER_WITH_ROLES = 'ADD_USER_WITH_ROLES';
  addUserWithRoles(user: User): Action {
    return {
      type: UserActions.ADD_USER_WITH_ROLES,
      payload: user
    };
  }

}
