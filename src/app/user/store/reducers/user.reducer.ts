import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { User } from '../../../model';
import { UserActions, UserActionTypes } from '../actions';


export function user(state: any = null, action: UserActions): User {
    switch (action.type) {
      case UserActionTypes.LOAD_USER_PROFILE_SUCCESS:
        return { ...state, ...action.payload};
      default:
        return state;
    }
  }


export function userProfileSaveStatus(state: any = 'NONE', action: UserActions): String {
    switch (action.type) {
        case UserActionTypes.ADD_USER_PROFILE:
            return 'IN PROCESS';
        case UserActionTypes.LOAD_USER_PROFILE:
            return 'NONE';
        default:
            return state;
    }
}

