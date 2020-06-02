import { UIStateActions } from './ui-state.actions';
import { testData } from 'test/data';


describe('setLoginRedirectUrl', () => {
    it('should create an action', () => {
        const action = new UIStateActions().setLoginRedirectUrl('/');
        expect(action.type).toEqual(UIStateActions.LOGIN_REDIRECT_URL);
        expect(action.payload).toEqual('/');
    });
});

describe('saveResetPasswordNotificationLogs', () => {
    it('should create an action', () => {
        const email = ['testuser@gmail.com'];
        const action = new UIStateActions().saveResetPasswordNotificationLogs(email);
        expect(action.type).toEqual(UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS);
        expect(action.payload).toEqual(email);
    });
});