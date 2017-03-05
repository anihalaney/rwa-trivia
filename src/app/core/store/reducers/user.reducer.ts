import { Observable } from 'rxjs/Observable';
import {Action} from '@ngrx/store';

import {UserActions} from '../actions';
import {User} from '../../../model';

export const user = (state: any = null, action: Action): User => {
  switch (action.type) {
    case UserActions.LOGOFF:
      return null;
    case UserActions.ADD_USER_WITH_ROLES:
      return action.payload;
    default:
      return state;
  }
};
