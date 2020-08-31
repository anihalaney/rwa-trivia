import { loginRedirectUrl, resetPasswordLogs } from './ui-state.reducer';
import { UIStateActions } from '../actions';

describe('Ui-StateReducer: loginRedirectUrl', () => {
    const _testReducer = loginRedirectUrl;

    it('Initial State', () => {
        const state: string = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify loginRedirectUrl function when action type is `LOGIN_REDIRECT_URL`', () => {
        const url = '/game-play/game-options/Single';

        const newState: string = _testReducer(url, { type: UIStateActions.LOGIN_REDIRECT_URL, payload: url });
        expect(newState).toEqual(url);
    });
});

describe('Ui-StateReducer: resetPasswordLogs', () => {
    const _testReducer = resetPasswordLogs;

    it('Initial State', () => {
        const state: string[] = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify resetPasswordLogs function when action type is `RESET_PASSWORD_NOTIFICATION_LOGS`', () => {
        const notificationLogs: string[] = [];
        notificationLogs.push('email sent to arpitpate@gmail.com');

        const newState: string[] = _testReducer(notificationLogs,
            {
                type: UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS, payload: notificationLogs
            });
        expect(newState).toEqual(notificationLogs);
    });
});
