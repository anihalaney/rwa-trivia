import { UserActions } from './user.actions';
import { testData } from 'test/data';
import { User, Invitation, Game } from 'shared-library/shared/model';
import { UserList } from 'test/data/user-list';


describe('logoff', () => {
    it('should create an action', () => {
        const action = new UserActions().logoff();
        expect(action.type).toEqual(UserActions.LOGOFF);
        expect(action.payload).toEqual(null);
    });
});

describe('loginSuccess', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions().loginSuccess(user);
        expect(action.type).toEqual(UserActions.LOGIN_SUCCESS);
        expect(action.payload).toEqual(user);
    });
});

describe('addUserWithRoles', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions().addUserWithRoles(user);
        expect(action.type).toEqual(UserActions.ADD_USER_WITH_ROLES);
        expect(action.payload).toEqual(user);
    });
});


describe('loadAccountsSuccess', () => {
    it('should create an action', () => {
        const account = testData.accounts[0];
        const action = new UserActions().loadAccountsSuccess(account);
        expect(action.type).toEqual(UserActions.LOAD_ACCOUNT_SUCCESS);
        expect(action.payload).toEqual(account);
    });
});

describe('storeInvitationToken', () => {
    it('should create an action', () => {
        const account = testData.userList[0];
        const action = new UserActions().storeInvitationToken
            ('ct7vhZOa__U:APA91bFCVEncCZg__c0P8kZo2k0WfCB_nVUds4sViaQiyPmUX7VUf29vfKUEQ4jRQ');
        expect(action.type).toEqual(UserActions.STORE_INVITATION_TOKEN);
        expect(action.payload).toEqual('ct7vhZOa__U:APA91bFCVEncCZg__c0P8kZo2k0WfCB_nVUds4sViaQiyPmUX7VUf29vfKUEQ4jRQ');
    });
});

describe('loadOtherUserProfile', () => {
    it('should create an action', () => {
        const action = new UserActions().loadOtherUserProfile(testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.LOAD_OTHER_USER_PROFILE);
        expect(action.payload).toEqual(testData.userList[0].userId);
    });
});

describe('loadOtherUserProfileSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().loadOtherUserProfileSuccess(testData.userList[0]);
        expect(action.type).toEqual(UserActions.LOAD_OTHER_USER_PROFILE_SUCCESS);
        expect(action.payload).toEqual(testData.userList[0]);
    });
});

describe('loadOtherUserExtendedInfo', () => {
    it('should create an action', () => {
        const action = new UserActions().loadOtherUserExtendedInfo(testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.LOAD_OTHER_USER_EXTEDED_INFO);
        expect(action.payload).toEqual(testData.userList[0].userId);
    });
});

describe('loadUserInvitationsInfo', () => {
    it('should create an action', () => {
        const payload = {
            userId: testData.userList[0].userId, invitedUserEmail: testData.userList[0].email,
            invitedUserId: testData.userList[0].userId
        };
        const action = new UserActions().loadUserInvitationsInfo(testData.userList[0].userId, testData.userList[0].email,
            testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.LOAD_USER_INVITATIONS_INFO);
        expect(action.payload).toEqual(payload);
    });
});

describe('loadUserInvitationsInfoSuccess', () => {
    it('should create an action', () => {
        const invitation: Invitation = testData.invitation;
        const action = new UserActions().loadUserInvitationsInfoSuccess(invitation);
        expect(action.type).toEqual(UserActions.LOAD_USER_INVITATION_INFO_SUCCESS);
        expect(action.payload).toEqual(invitation);
    });
});

describe('loadOtherUserProfileWithExtendedInfoSuccess', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions().loadOtherUserProfileWithExtendedInfoSuccess(user);
        expect(action.type).toEqual(UserActions.LOAD_OTHER_USER_PROFILE_EXTENDED_INFO_SUCCESS);
        expect(action.payload).toEqual(user);
    });
});

describe('updateUser', () => {
    it('should create an action', () => {
        const payload = { user: testData.userList[0], status: 'CREATED' };
        const action = new UserActions().updateUser(testData.userList[0], 'CREATED');
        expect(action.type).toEqual(UserActions.UPDATE_USER);
        expect(action.payload).toEqual(payload);
    });
});

describe('updateUserSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().updateUserSuccess('UPDATED');
        expect(action.type).toEqual(UserActions.UPDATE_USER_SUCCESS);
        expect(action.payload).toEqual('UPDATED');
    });
});

describe('loadGameInvites', () => {
    it('should create an action', () => {
        const action = new UserActions().loadGameInvites(testData.userList[0]);
        expect(action.type).toEqual(UserActions.LOAD_GAME_INVITES);
        expect(action.payload).toEqual(testData.userList[0]);
    });
});

describe('loadGameInvitesSuccess', () => {
    it('should create an action', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new UserActions().loadGameInvitesSuccess(games);
        expect(action.type).toEqual(UserActions.LOAD_GAME_INVITES_SUCCESS);
        expect(action.payload).toEqual(games);
    });
});

describe('rejectGameInvitation', () => {
    it('should create an action', () => {
        const action = new UserActions().rejectGameInvitation('Game invitation is rejected');
        expect(action.type).toEqual(UserActions.REJECT_GAME_INVITATION);
        expect(action.payload).toEqual('Game invitation is rejected');
    });
});

describe('updateGameSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().updateGameSuccess();
        expect(action.type).toEqual(UserActions.UPDATE_GAME_SUCCESS);
        expect(action.payload).toEqual('');
    });
});

describe('loadUserFriends', () => {
    it('should create an action', () => {
        const action = new UserActions().loadUserFriends(testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.LOAD_USER_FRIENDS);
        expect(action.payload).toEqual(testData.userList[0].userId);
    });
});


describe('loadUserFriendsSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().loadUserFriendsSuccess(testData.friendsList);
        expect(action.type).toEqual(UserActions.LOAD_USER_FRIENDS_SUCCESS);
        expect(action.payload).toEqual(testData.friendsList);
    });
});

describe('loadUserInvitationsSuccess', () => {
    it('should create an action', () => {
        const invitation: any = testData.invitation;
        const action = new UserActions().loadUserInvitationsSuccess(invitation);
        expect(action.type).toEqual(UserActions.LOAD_FRIEND_INVITATION_SUCCESS);
        expect(action.payload).toEqual(invitation);
    });
});

describe('updateInvitation', () => {
    it('should create an action', () => {
        const invitation: Invitation = testData.invitation;
        const action = new UserActions().updateInvitation(invitation);
        expect(action.type).toEqual(UserActions.UPDATE_INVITATION);
        expect(action.payload).toEqual(invitation);
    });
});

describe('updateInvitation', () => {
    it('should create an action', () => {
        const invitation: Invitation = testData.invitation;
        const action = new UserActions().updateInvitation(invitation);
        expect(action.type).toEqual(UserActions.UPDATE_INVITATION);
        expect(action.payload).toEqual(invitation);
    });
});

describe('makeFriend', () => {
    it('should create an action', () => {
        const payload: any = { token: testData.invitation.id, email: testData.userList[0].email, userId: testData.userList[0].userId };
        const action = new UserActions().makeFriend(payload);
        expect(action.type).toEqual(UserActions.MAKE_FRIEND);
        expect(action.payload).toEqual(payload);
    });
});

describe('makeFriendSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().makeFriendSuccess();
        expect(action.type).toEqual(UserActions.MAKE_FRIEND_SUCCESS);
        expect(action.payload).toEqual(null);
    });
});

describe('addUserInvitation', () => {
    it('should create an action', () => {
        const action = new UserActions().addUserInvitation(testData.invitation);
        expect(action.type).toEqual(UserActions.ADD_USER_INVITATION);
        expect(action.payload).toEqual(testData.invitation);
    });
});

describe('addUserInvitationSuccess', () => {
    it('should create an action', () => {
        const payload: any = { email: 'demo@gmail.com'};
        const action = new UserActions().addUserInvitationSuccess(payload);
        expect(action.type).toEqual(UserActions.ADD_USER_INVITATION_SUCCESS);
        expect(action.payload).toEqual(payload);
    });
});

describe('addUserProfile', () => {
    it('should create an action', () => {
        const payload = { user: testData.userList[0], isLocationChanged: true }
        const action = new UserActions().addUserProfile(testData.userList[0], true);
        expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
        expect(action.payload).toEqual(payload);
    });
});

describe('addFeedback', () => {
    it('should create an action', () => {
        const payload: any = { email: testData.userList[0].email, feedback: 'Test feedback' }
        const action = new UserActions().addFeedback(payload);
        expect(action.type).toEqual(UserActions.ADD_FEEDBACK);
        expect(action.payload).toEqual(payload);
    });
});


describe('getCountries', () => {
    it('should create an action', () => {
        const payload = { user: testData.userList[0], isLocationChanged: true }
        const action = new UserActions().getCountries();
        expect(action.type).toEqual(UserActions.GET_COUNTRIES);
        expect(action.payload).toEqual(null);
    });
});


describe('loadCountriesSuccess', () => {
    it('should create an action', () => {
        const payload: any = testData.countries;
        const action = new UserActions().loadCountriesSuccess(payload);
        expect(action.type).toEqual(UserActions.LOAD_COUNTRIES_SUCCESS);
        expect(action.payload).toEqual(payload);
    });
});

describe('addUserProfileSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().addUserProfileSuccess();
        expect(action.type).toEqual(UserActions.ADD_USER_PROFILE_SUCCESS);
        expect(action.payload).toEqual(null);
    });
});


describe('addFeedbackSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().addFeedbackSuccess();
        expect(action.type).toEqual(UserActions.ADD_FEEDBACK_SUCCESS);
        expect(action.payload).toEqual(null);
    });
});

describe('addUserLives', () => {
    it('should create an action', () => {
        const action = new UserActions().addUserLives(testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.ADD_USER_LIVES);
        expect(action.payload).toEqual(testData.userList[0].userId);
    });
});
describe('addUserLivesSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().addUserLivesSuccess();
        expect(action.type).toEqual(UserActions.ADD_USER_LIVES_SUCCESS);
        expect(action.payload).toEqual(null);
    });
});
describe('getGameResult', () => {
    it('should create an action', () => {
        const action = new UserActions().getGameResult(testData.userList[0]);
        expect(action.type).toEqual(UserActions.GET_GAME_RESULT);
        expect(action.payload).toEqual(testData.userList[0]);
    });
});


describe('getGameResultSuccess', () => {
    it('should create an action', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new UserActions().getGameResultSuccess(games);
        expect(action.type).toEqual(UserActions.GET_GAME_RESULT_SUCCESS);
        expect(action.payload).toEqual(games);
    });
});

describe('loadAddressUsingLatLong', () => {
    it('should create an action', () => {
        const action = new UserActions().loadAddressUsingLatLong('-34.8799074,174.7565664');
        expect(action.type).toEqual(UserActions.LOAD_ADDRESS_USING_LAT_LONG);
        expect(action.payload).toEqual('-34.8799074,174.7565664');
    });
});

describe('loadAddressUsingLatLongSuccess', () => {
    it('should create an action', () => {
        const location: any = '-34.8799074,174.7565664';
        const action = new UserActions().loadAddressUsingLatLongSuccess(location);
        expect(action.type).toEqual(UserActions.LOAD_ADDRESS_USING_LAT_LONG_SUCCESS);
        expect(action.payload).toEqual(location);
    });
});

describe('loadAddressSuggestions', () => {
    it('should create an action', () => {
        const location = '-34.8799074,174.7565664';
        const action = new UserActions().loadAddressSuggestions(location);
        expect(action.type).toEqual(UserActions.LOAD_ADDRESS_SUGGESTIONS);
        expect(action.payload).toEqual(location);
    });
});

describe('loadAddressSuggestionsSuccess', () => {
    it('should create an action', () => {
        const suggestions = testData.suggestions;
        const action = new UserActions().loadAddressSuggestionsSuccess(suggestions);
        expect(action.type).toEqual(UserActions.LOAD_ADDRESS_SUGGESTIONS_SUCCESS);
        expect(action.payload).toEqual(suggestions);
    });
});

describe('checkDisplayName', () => {
    it('should create an action', () => {
        const action = new UserActions().checkDisplayName('Test address');
        expect(action.type).toEqual(UserActions.CHECK_DISPLAY_NAME);
        expect(action.payload).toEqual('Test address');
    });
});
describe('checkDisplayNameSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().checkDisplayNameSuccess(true);
        expect(action.type).toEqual(UserActions.CHECK_DISPLAY_NAME_SUCCESS);
        expect(action.payload).toEqual(true);
    });
});

describe('setFirstQuestionBits', () => {
    it('should create an action', () => {
        const action = new UserActions().setFirstQuestionBits(testData.userList[0].userId);
        expect(action.type).toEqual(UserActions.SET_FIRST_QUESTION_BITS);
        expect(action.payload).toEqual(testData.userList[0].userId);
    });
});

describe('setFirstQuestionBitsSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions().setFirstQuestionBitsSuccess('Test Message');
        expect(action.type).toEqual(UserActions.SET_FIRST_QUESTION_BITS_SUCCESS);
        expect(action.payload).toEqual('Test Message');
    });
});

