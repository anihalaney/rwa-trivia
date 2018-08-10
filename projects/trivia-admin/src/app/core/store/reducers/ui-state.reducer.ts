import { Observable } from 'rxjs';
import {Action} from '@ngrx/store';

import { ActionWithPayload, UIStateActions } from '../actions';

export function loginRedirectUrl(state: any = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UIStateActions.LOGIN_REDIRECT_URL:
      return action.payload;
    default:
      return state;
  }
};
