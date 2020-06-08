import { ActionWithPayload, UIStateActions } from '../actions';

export function loginRedirectUrl(state: any = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case UIStateActions.LOGIN_REDIRECT_URL:
      return action.payload;
    default:
      return state;
  }
}

export function resetPasswordLogs(state: any = [], action: ActionWithPayload<string[]>): string[] {
  switch (action.type) {
    case UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS:
      return action.payload;
    default:
      return state;
  }
}
