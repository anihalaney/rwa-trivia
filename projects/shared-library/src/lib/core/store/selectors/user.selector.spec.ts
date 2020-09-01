
import { testData } from 'test/data';
import { authorizationHeader, getUser } from './user.selector';
describe('User:Selector', () => {
    const user = testData.userList[0];

    it('Get User selector return user object', () => {
        const state = { core: { user } };
        expect(getUser(state)).toBe(user);
    });

    it('Get idToken token from user', () => {
        const state = { core: { user } };
        const token = `Bearer ${user.idToken}`;
        expect(authorizationHeader(state)).toBe(token);
    });

    it('Get null if user is not find', () => {
        const state = { core: { user: '' } };
        expect(authorizationHeader(state)).toBe(null);
    });
});

