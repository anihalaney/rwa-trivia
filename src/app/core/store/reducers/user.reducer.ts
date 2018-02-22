import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { ActionWithPayload, UserActions } from '../actions';
import { User } from '../../../model';

export function user(state: any = null, action: ActionWithPayload<User>): User {
  switch (action.type) {
    case UserActions.LOGOFF:
      return null;
    case UserActions.ADD_USER_WITH_ROLES:
      return action.payload;
    case UserActions.LOAD_USER_PROFILE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function authInitialized(state: any = false, action: ActionWithPayload<any>): boolean {
  switch (action.type) {
    case UserActions.LOGOFF:
    case UserActions.ADD_USER_WITH_ROLES:
      return true;
    default:
      return state;
  }
}

export function userProfileSaveStatus(state: any = 'NONE', action: ActionWithPayload<null>): string {
  switch (action.type) {
    case UserActions.ADD_USER_PROFILE:
    return 'IN PROCESS'
    case UserActions.ADD_USER_PROFILE_SUCCESS:
      return 'SUCCESS';
    default:
      return state;
  }
}
