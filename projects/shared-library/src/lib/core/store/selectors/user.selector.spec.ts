
import { testData } from 'test/data';
import { authorizationHeader, getUser } from './user.selector';
describe('User:Selector', () => {
    const user = testData.userList[0];

    it('getUser', () => {
        const state = { core: { user } };
        expect(getUser(state)).toBe(user);
    });

    it('getUser', () => {
        const state = { core: { user } };
        const token = `Bearer ${user.idToken}`;
        expect(authorizationHeader(state)).toBe(token);
    });

    it('authorizationHeader with null', () => {
        const state = { core: { user: '' } };
        expect(authorizationHeader(state)).toBe(null);
    });
});

