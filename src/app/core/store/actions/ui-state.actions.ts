import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

@Injectable()
export class UIStateActions {

  static LOGIN_REDIRECT_URL = 'LOGIN_REDIRECT_URL';
  setLoginRedirectUrl(url?: string): Action {
    return {
      type: UIStateActions.LOGIN_REDIRECT_URL,
      payload: url
    };
  }

}
