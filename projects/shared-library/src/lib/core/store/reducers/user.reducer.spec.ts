import {
    user, userDict, gameInvites, userFriendInvitations, userProfileSaveStatus, checkDisplayName,
    invitationToken, authInitialized, getAuthorizationHeader, userFriends, addressSuggestions,
    friendInvitations, feedback, account, getGameResult, countries, addressUsingLongLat, userUpdateStatus,
    firstQuestionBits
} from './user.reducer';
import { testData } from 'test/data';
import { User, Invitation, Game, Friend } from 'shared-library/shared/model';
import { UserActions } from '../actions';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';
const userData = testData.userList[0];

describe('UserReducer: user', () => {
    const _testReducer = user;

    it('Initial State', () => {
        const state: User = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Add user with roles', () => {
        const newState: User = _testReducer(userData, { type: UserActions.ADD_USER_WITH_ROLES, payload: userData });
        expect(newState).toEqual(userData);
    });
});

describe('UserReducer: userDict', () => {
    const _testReducer = userDict;
    const userDictData = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': userData };

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual({});
    });

    it('Load other user profile extended info', () => {
        const newState = _testReducer(userDictData, { type: UserActions.LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS, payload: userData });
        expect(newState).toEqual(userDictData);
    });

    it('Load other user profile', () => {
        const newState = _testReducer(userDictData, { type: UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS, payload: userData });
        expect(newState).toEqual(userDictData);
    });

    it('Verify load other user profile when payload is null', () => {
        const newState = _testReducer(userDictData, { type: UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS, payload: null });
        expect(newState).toEqual(userDictData);
    });
});

describe('UserReducer: userFriendInvitations', () => {
    const _testReducer = userFriendInvitations;
    const invitation: Invitation = testData.invitation;
    const friendInvite = { 'data6@data.com': testData.invitation };

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual({});
    });

    it('Load user invitation info', () => {
        const newState = _testReducer(friendInvite, { type: UserActions.LOAD_USER_INVITATION_INFO_SUCCESS, payload: invitation });
        expect(newState).toEqual(friendInvite);
    });

    it('Verify load user invitation info when payload is null', () => {
        const newState = _testReducer(friendInvite, { type: UserActions.LOAD_USER_INVITATION_INFO_SUCCESS, payload: null });
        expect(newState).toEqual(friendInvite);
    });
});

describe('UserReducer: authInitialized', () => {
    const _testReducer = authInitialized;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toBe(false);
    });

    it('Verify logoff action type in authInitialized function', () => {
        const newState = _testReducer(false, { type: UserActions.LOGOFF, payload: null });
        expect(newState).toEqual(true);
    });

    it('Add user with roles', () => {
        const newState = _testReducer(true, { type: UserActions.ADD_USER_WITH_ROLES, payload: userData });
        expect(newState).toEqual(true);
    });
});

describe('UserReducer: getAuthorizationHeader', () => {
    const _testReducer = getAuthorizationHeader;

    it('Verify getAuthorizationHeader function work correctly', () => {
        const newState = _testReducer(userData);
        expect(newState).toEqual('Bearer ' + userData.idToken);
    });

    it('Verify getAuthorizationHeader function when user is not available', () => {
        const newState = _testReducer(undefined);
        expect(newState).toBeNull();
    });
});

describe('UserReducer: invitationToken', () => {
    const _testReducer = invitationToken;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toBe('NONE');
    });

    it('Store invitation token', () => {
        const newState = _testReducer(userData.idToken, { type: UserActions.STORE_INVITATION_TOKEN, payload: userData.idToken });
        expect(newState).toEqual(userData.idToken);
    });
});

describe('UserReducer: gameInvites', () => {
    const _testReducer = gameInvites;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Load game Invites', () => {
        const games: Game[] = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const newState = _testReducer(games, { type: UserActions.LOAD_GAME_INVITES_SUCCESS, payload: games });
        expect(newState).toEqual(games);
    });
});

describe('UserReducer: userFriends', () => {
    const _testReducer = userFriends;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toBe(null);
    });

    it('Load user friends', () => {
        const friends: Friend[] = testData.friendsList;
        const newState = _testReducer(friends, { type: UserActions.LOAD_USER_FRIENDS_SUCCESS, payload: friends });
        expect(newState).toEqual(friends);
    });
});

describe('UserReducer: friendInvitations', () => {
    const _testReducer = friendInvitations;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Load friend invitation', () => {
        const invitation: Invitation[] = [];
        invitation.push(testData.invitation);
        const friendInvite = { 'data6@data.com': testData.invitation };
        const newState = _testReducer(friendInvite, { type: UserActions.LOAD_FRIEND_INVITATION_SUCCESS, payload: invitation });
        expect(newState).toEqual(invitation);
    });
});

describe('UserReducer: userProfileSaveStatus', () => {
    const _testReducer = userProfileSaveStatus;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify userProfileSaveStatus function when status is `IN PROCESS`', () => {
        const newState = _testReducer('IN PROCESS', {
            type: UserActions.ADD_USER_PROFILE,
            payload: 'user data'
        });
        expect(newState).toEqual('IN PROCESS');
    });

    it('Verify userProfileSaveStatus function when status is `SUCCESS`', () => {
        const newState = _testReducer('SUCCESS', {
            type: UserActions.ADD_USER_PROFILE_SUCCESS,
            payload: null
        });
        expect(newState).toEqual('SUCCESS');
    });

    it('Verify userProfileSaveStatus function when user invitation added successfully', () => {
        const invitation: Invitation = testData.invitation;
        const newState = _testReducer(invitation, {
            type: UserActions.ADD_USER_INVITATION_SUCCESS,
            payload: 'Invitation send'
        });
        expect(newState).toEqual('Invitation send');
    });

    it('Verify userProfileSaveStatus function when status is `MAKE FRIEND SUCCESS`', () => {
        const newState = _testReducer('MAKE FRIEND SUCCESS', {
            type: UserActions.MAKE_FRIEND_SUCCESS,
            payload: null
        });
        expect(newState).toEqual('MAKE FRIEND SUCCESS');
    });
});

describe('UserReducer: feedback', () => {
    const _testReducer = feedback;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify feedback function when action type is `ADD_FEEDBACK`', () => {
        const newState = _testReducer('add feedback', { type: UserActions.ADD_FEEDBACK, payload: 'add feedback' });
        expect(newState).toEqual('add feedback');
    });

    it('Verify feedback function when action type is `ADD_FEEDBACK_SUCCESS`', () => {
        const newState = _testReducer('SUCCESS', { type: UserActions.ADD_FEEDBACK_SUCCESS, payload: null });
        expect(newState).toEqual('SUCCESS');
    });
});

describe('UserReducer: account', () => {
    const _testReducer = account;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify account function when action type is `LOAD_ACCOUNT_SUCCESS`', () => {
        const accountDetail = testData.userList[0].account;
        const newState = _testReducer(accountDetail, { type: UserActions.LOAD_ACCOUNT_SUCCESS, payload: accountDetail });
        expect(newState).toEqual(accountDetail);
    });
});

describe('UserReducer: getGameResult', () => {
    const _testReducer = getGameResult;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify getGameResult function when action type is `GET_GAME_RESULT_SUCCESS`', () => {
        const games: Game[] = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const newState: Game[] = _testReducer(games, { type: UserActions.GET_GAME_RESULT_SUCCESS, payload: games });
        expect(newState).toEqual(games);
    });
});

describe('UserReducer: countries', () => {
    const _testReducer = countries;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual([]);
    });

    it('Verify countries function when action type is `LOAD_COUNTRIES_SUCCESS`', () => {
        const countriesList: Country[] = testData.countries;
        const newState: Country[] = _testReducer(countriesList, { type: UserActions.LOAD_COUNTRIES_SUCCESS, payload: countriesList });
        expect(newState).toEqual(countriesList);
    });
});

describe('UserReducer: addressUsingLongLat', () => {
    const _testReducer = addressUsingLongLat;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify addressUsingLongLat function when action type is `LOAD_ADDRESS_USING_LAT_LONG_SUCCESS`', () => {
        const location: any[] = ['Ahmedabad', 'Surat', 'Rajkot'];
        const newState: any = _testReducer(location, { type: UserActions.LOAD_ADDRESS_USING_LAT_LONG_SUCCESS, payload: location });
        expect(newState).toEqual(location);
    });
});

describe('UserReducer: addressSuggestions', () => {
    const _testReducer = addressSuggestions;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify addressSuggestions function when action type is `LOAD_ADDRESS_SUGGESTIONS_SUCCESS`', () => {
        const suggestions: any[] = ['Ahmedabad', 'Surat', 'Rajkot'];
        const newState: any = _testReducer(suggestions, { type: UserActions.LOAD_ADDRESS_SUGGESTIONS_SUCCESS, payload: suggestions });
        expect(newState).toEqual(suggestions);
    });
});

describe('UserReducer: checkDisplayName', () => {
    const _testReducer = checkDisplayName;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify checkDisplayName function when action type is `CHECK_DISPLAY_NAME_SUCCESS`', () => {
        const result = true;
        const newState: any = _testReducer(result, { type: UserActions.CHECK_DISPLAY_NAME_SUCCESS, payload: result });
        expect(newState).toEqual(result);
    });
});

describe('UserReducer: userUpdateStatus', () => {
    const _testReducer = userUpdateStatus;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify userUpdateStatus function when action type is `UPDATE_USER_SUCCESS`', () => {
        const updateStatus = 'SUCCESS';
        const newState: any = _testReducer(updateStatus, { type: UserActions.UPDATE_USER_SUCCESS, payload: updateStatus });
        expect(newState).toEqual(updateStatus);
    });
});

describe('UserReducer: firstQuestionBits', () => {
    const _testReducer = firstQuestionBits;

    it('Initial State', () => {
        const state = _testReducer(undefined, { type: null, payload: null });
        expect(state).toEqual(null);
    });

    it('Verify firstQuestionBits function when action type is `SET_FIRST_QUESTION_BITS_SUCCESS`', () => {
        const msg = 'Question bits set up successfully!';
        const newState: any = _testReducer(msg, { type: UserActions.SET_FIRST_QUESTION_BITS_SUCCESS, payload: msg });
        expect(newState).toEqual(msg);
    });
});
