import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import {Action} from '@ngrx/store';

import { UIStateActions } from '../actions';

export const loginRedirectUrl = (state: any = null, action: Action): string => {
  switch (action.type) {
    case UIStateActions.LOGIN_REDIRECT_URL:
      return action.payload;
    default:
      return state;
  }
};
