import { Observable } from 'rxjs';
import { GameService, UserService, Utils } from 'shared-library/core/services';
import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { UserActions } from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold, Scheduler } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game, RouterStateUrl } from 'shared-library/shared/model';
import { UserEffects } from './user.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState } from 'shared-library/core/store';
import { of } from 'rxjs';
import { Invitation, DrawerConstants } from '../../../shared/model';
import { RouterNavigationPayload, RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { RoutesRecognized } from '@angular/router';

describe('Effects: UserEffects', () => {
    let effects: UserEffects;
    let actions$: Observable<any>;
    let gameService: GameService;
    let userService: UserService;
    let utils: Utils;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const user: User = testData.userList[0];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [
                UserActions,
                UserEffects,
                {
                    provide: Utils,
                    useValue: {
                        setLoginFirebaseAnalyticsParameter(user: User) {
                            return of(user);
                        }
                    }
                },
                {
                    provide: GameService,
                    useValue: {}
                },
                {
                    provide: UserService,
                    useValue: { loadOtherUserProfile() { } }
                },
                provideMockStore({
                    initialState: { 'core': { user } },
                    selectors: [
                        {
                            selector: coreState,
                            value: { user }
                        }
                    ]
                }),
                provideMockActions(() => actions$),
            ],
        });
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, { user });
        effects = TestBed.get(UserEffects);
        gameService = TestBed.get(GameService);
        userService = TestBed.get(UserService);
        utils = TestBed.get(Utils);
        actions$ = TestBed.get(Actions);
        mockStore.refreshState();
    }));

    it('Load user profile', () => {
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().addUserWithRoles(user);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user });
        const expected = cold('--b', { b: completion });
        userService.loadUserProfile = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserProfile$).toBeObservable(expected);
    });


    it('When loadUserProfile service return error then it should return empty observable ', () => {
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().addUserWithRoles(null);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a#', { a: null });
        const expected = cold('--b', { b: completion });
        userService.loadUserProfile = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserProfile$).toBeObservable(expected);
    });

    it('When setLoginFirebaseAnalyticsParameter service return error then it should return empty observable ', () => {
        const action = new UserActions().loginSuccess(null);
        const completion = new UserActions().addUserWithRoles(null);

        actions$ = hot('-a-b-', { a: action });
        const response = cold('-a|', { a: null });
        const responseLogin = cold('-b#', { b: { error: 'error message' } });
        const expected = cold('---|', { b: completion });
        userService.loadUserProfile = jest.fn(() => {
            return response;
        });

        utils.setLoginFirebaseAnalyticsParameter = jest.fn(() => {
            return responseLogin;
        });

        expect(effects.loadUserProfile$).toBeObservable(expected);
    });



    it('When loadUserProfile service return error then it should return empty observable ', () => {
        const action = new UserActions().loginSuccess(null);
        const completion = new UserActions().addUserWithRoles(null);

        actions$ = hot('-a---', { a: action });
        const response = cold('----', { a: null });
        const expected = cold('----');
        userService.loadUserProfile = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserProfile$).toBeObservable(expected);
    });





    it('Load user account', () => {
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().loadAccountsSuccess(user.account);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user.account });
        const expected = cold('--b', { b: completion });
        userService.loadAccounts = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserAccounts$).toBeObservable(expected);
    });


    it('Load user account: when error error occurred then it should return null array', () => {
        const action = new UserActions().loginSuccess(user);
        const completion = new UserActions().loadAccountsSuccess(null);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a#', { a: null });
        const expected = cold('--b', { b: completion });
        userService.loadAccounts = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserAccounts$).toBeObservable(expected);
    });

    // loadOtherUserProfile
    it('Load other user profile', () => {
        const action = new UserActions().loadOtherUserProfile(user.userId);
        const completion = new UserActions().loadOtherUserProfileSuccess(user);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user });
        const expected = cold('---b', { b: completion });

        const spy = spyOn(userService, 'loadOtherUserProfile').and.callThrough();

        userService.loadOtherUserProfile = jest.fn(() => {
            return response;
        });
        userService.getUserStatus = jest.fn(() => {
            return response;
        });
        expect(effects.loadOtherUserProfile$).toBeObservable(expected);
    });


    // loadOtherUserProfile Error
    it('Load other user profile error should return empty object', () => {
        const action = new UserActions().loadOtherUserProfile(user.userId);
        const completion = new UserActions().loadOtherUserProfileSuccess(null);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a#', { a: null });
        const expected = cold('---|');

        const spy = spyOn(userService, 'loadOtherUserProfile').and.callThrough();

        userService.loadOtherUserProfile = jest.fn(() => {
            return response;
        });
        userService.getUserStatus = jest.fn(() => {
            return response;
        });
        expect(effects.loadOtherUserProfile$).toBeObservable(expected);
    });

    // loadOtherUserExtendedInfo
    it('Load other user exiended info', () => {
        const action = new UserActions().loadOtherUserExtendedInfo(user.userId);
        const completion = new UserActions().loadOtherUserProfileWithExtendedInfoSuccess(user);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user });
        const expected = cold('---b', { b: completion });
        userService.loadOtherUserProfileWithExtendedInfo = jest.fn(() => {
            return response;
        });
        userService.getUserStatus = jest.fn(() => {
            return response;
        });
        expect(effects.loadOtherUserExtendedInfo$).toBeObservable(expected);
    });


    // loadUserInvitationsInfo
    it('load User Invitations Info', () => {
        const user: User = testData.userList[0];
        const invitedUser: User = testData.userList[1];

        const invited: Invitation = {
            created_uid: user.userId,
            email: invitedUser.email,
            id: 'OYXPXnqU2ua2mwXlbRHT',
            status: 'pending'
        };
        const action = new UserActions().loadUserInvitationsInfo(user.userId, invitedUser.email, invitedUser.userId);
        const completion = new UserActions().loadUserInvitationsInfoSuccess(invited);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: invited });
        const expected = cold('--b', { b: completion });
        userService.loadUserInvitationsInfo = jest.fn(() => {
            return response;
        });
        expect(effects.loadUserInvitationsInfo$).toBeObservable(expected);
    });


    // UpdateUser
    it('Update User', () => {

        const action = new UserActions().updateUser(user, DrawerConstants.UPDATE_TOKEN_STATUS);
        const completion = new UserActions().updateUserSuccess(DrawerConstants.UPDATE_TOKEN_STATUS);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: DrawerConstants.UPDATE_TOKEN_STATUS });
        const expected = cold('--b', { b: completion });
        userService.updateUser = jest.fn(() => {
            return response;
        });
        expect(effects.UpdateUser$).toBeObservable(expected);
    });

    // loadGameInvites
    it('load Game Invites', () => {
        const inviteGames = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const action = new UserActions().loadGameInvites(user);
        const completion = new UserActions().loadGameInvitesSuccess(inviteGames);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: inviteGames });
        const expected = cold('--b', { b: completion });
        userService.getGameInvites = jest.fn(() => {
            return response;
        });
        expect(effects.loadGameInvites$).toBeObservable(expected);
    });

    // rejectGameInvitation
    it('Reject Game Invitation', () => {
        const gameId = testData.games[0].gameId;
        const action = new UserActions().rejectGameInvitation(gameId);
        const completion = new UserActions().updateGameSuccess();

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: '' });
        const expected = cold('--b', { b: completion });
        userService.rejectGameInvitation = jest.fn(() => {
            return response;
        });
        expect(effects.rejectGameInvitation$).toBeObservable(expected);
    });


    // LoadUserFriends
    it('LoadUserFriends', () => {
        const friendList = testData.friendsList;
        const action = new UserActions().loadUserFriends(user.userId);
        const completion = new UserActions().loadUserFriendsSuccess(friendList);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: friendList });
        const expected = cold('---b', { b: completion });
        userService.loadUserFriends = jest.fn(() => {
            return response;
        });

        userService.getOtherUserGamePlayedStat = jest.fn(() => {
            return response;
        });
        expect(effects.LoadUserFriends$).toBeObservable(expected);
    });

    // loadFriendInvitations
    it('loadFriendInvitations', () => {

        const invitations: Invitation[] = [testData.invitation];
        const game = Game.getViewModel(testData.games[0]);
        const routerState: RouterStateUrl = { url: `/dashboard`, queryParams: {}, params: {} };
        const event: RoutesRecognized = new RoutesRecognized(1, `/dashboard`, '', null);
        const payload: RouterNavigationPayload<RouterStateUrl> = {
            routerState,
            event
        };

        const action: RouterNavigationAction<RouterStateUrl> = {
            type: ROUTER_NAVIGATION,
            payload
        };

        const completion = new UserActions().loadUserInvitationsSuccess(invitations);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: invitations });
        const expected = cold('--b', { b: completion });
        userService.loadFriendInvitations = jest.fn(() => {
            return response;
        });
        expect(effects.loadFriendInvitations$).toBeObservable(expected);
    });

    // UpdateInvitation
    it('UpdateInvitation', () => {
        const invitedUser: User = testData.userList[1];
        const invited: Invitation = {
            created_uid: user.userId,
            email: invitedUser.email,
            id: 'OYXPXnqU2ua2mwXlbRHT',
            status: 'pending'
        };
        const completion = new UserActions().updateInvitationSuccess();

        const action = new UserActions().updateInvitation(invited);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: '' });
        const expected = cold('--b', { b: completion });
        userService.setInvitation = jest.fn(() => {
            return response;
        });
        expect(effects.UpdateInvitation$).toBeObservable(expected);
    });


    // makeFriend
    it('makeFriend', () => {
        const invitationId = 'DFld3ZlJhbGJ7Ko';
        const payload = { token: invitationId, email: user.email, userId: user.userId }
        const action = new UserActions().makeFriend(payload);
        const completion = new UserActions().makeFriendSuccess();

        actions$ = hot('-a---', { a: action });
        const response = cold('--a|', { a: null });
        const expected = cold('---b', { b: completion });
        userService.checkInvitationToken = jest.fn(() => {
            return response;
        });
        expect(effects.makeFriend$).toBeObservable(expected);
    });


    // saveInvitation
    it('saveInvitation', () => {

        const message = { messages: 'Your Invitation sent successfully' };
        const action = new UserActions().addUserInvitation(user);
        const completion = new UserActions().addUserInvitationSuccess(message.messages);

        actions$ = hot('-a---', { a: action });
        const response = cold('--a|', { a: message });
        const expected = cold('---b', { b: completion });
        userService.saveUserInvitations = jest.fn(() => {
            return response;
        });

        expect(effects.saveInvitation$).toBeObservable(expected);
    });


    // addUser
    it('addUser', () => {
        const isLocationChanged = false;
        const action = new UserActions().addUserProfile(user, isLocationChanged);
        const completion = new UserActions().addUserProfileSuccess();

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: user });
        const responseRes = cold('-a|', { a: 'success' });
        const expected = cold('---b', { b: completion });
        userService.saveUserProfile = jest.fn(() => {
            return response;
        });

        utils.setUserLocationFirebaseAnalyticsParameter = jest.fn(() => {
            return responseRes;
        });

        expect(effects.addUser$).toBeObservable(expected);
    });

    // addFeedback
    it('addFeedback', () => {
        const feedback = 'bitWiser app is awesome';

        const action = new UserActions().addFeedback(feedback);
        const completion = new UserActions().addFeedbackSuccess();

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: '' });
        const expected = cold('--b', { b: completion });

        userService.addFeedback = jest.fn(() => {
            return response;
        });
        expect(effects.addFeedback$).toBeObservable(expected);
    });


    // getCountries
    it('getCountries', () => {
        const countries = testData.countries;
        const action = new UserActions().getCountries();
        const completion = new UserActions().loadCountriesSuccess(countries);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: countries });
        const expected = cold('--b', { b: completion });

        userService.getCountries = jest.fn(() => {
            return response;
        });
        expect(effects.getCountries$).toBeObservable(expected);
    });

    // AddUserLives
    it('AddUserLives', () => {

        const action = new UserActions().addUserLives(user.userId);
        const completion = new UserActions().addUserLivesSuccess();
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: '' });
        const expected = cold('--b', { b: completion });


        userService.addUserLives = jest.fn(() => {
            return response;
        });
        expect(effects.AddUserLives$).toBeObservable(expected);
    });

    // GetGameResult
    it('GetGameResult', () => {

        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });

        const action = new UserActions().getGameResult(user);
        const completion = new UserActions().getGameResultSuccess(games);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: games });
        const expected = cold('--b', { b: completion });

        gameService.getGameResult = jest.fn(() => {
            return response;
        });
        expect(effects.GetGameResult$).toBeObservable(expected);
    });


    // // checkDisplayName
    it('checkDisplayName', () => {
        const userName = 'PI';
        const action = new UserActions().checkDisplayName(userName);
        const completion = new UserActions().checkDisplayNameSuccess(true);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: true });
        const expected = cold('--b', { b: completion });

        userService.checkDisplayName = jest.fn(() => {
            return response;
        });
        expect(effects.checkDisplayName$).toBeObservable(expected);
    });

    // setFirstQuestionBits
    it('setFirstQuestionBits', () => {
        const userId = user.userId;
        const msg = 'First Question bits added successfully.';
        const action = new UserActions().setFirstQuestionBits(userId);
        const completion = new UserActions().setFirstQuestionBitsSuccess(msg);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: msg });
        const expected = cold('--b', { b: completion });

        userService.firstQuestionSetBits = jest.fn(() => {
            return response;
        });
        expect(effects.setFirstQuestionBits).toBeObservable(expected);
    });


    // loadAddressUsingLatLong
    it('loadAddressUsingLatLong', () => {
        const latLong = '23.0457344,72.64010240000002';
        const addressUsingLongLat = [testData.addressUsingLongLat];
        const action = new UserActions().loadAddressUsingLatLong(latLong);
        const completion = new UserActions().loadAddressUsingLatLongSuccess(addressUsingLongLat);

        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: addressUsingLongLat });
        const expected = cold('--b', { b: completion });

        userService.getAddressByLatLang = jest.fn(() => {
            return response;
        });
        expect(effects.loadAddressUsingLatLong).toBeObservable(expected);
    });

    //  loadAddressSuggestions
    it('loadAddressSuggestions', fakeAsync(() => {

        const location = 'Ahme';
        const addressSuggestion = [testData.addressSuggestion];
        const action = new UserActions().loadAddressSuggestions(location);

        const location2 = 'Ahmeme';
        const action2 = new UserActions().loadAddressSuggestions(location2);

        // create an actions stream to represent a user that is typing
        actions$ = hot('-a-b-', {
            a: action,
            b: action2,
        });
        const completion = new UserActions().loadAddressSuggestionsSuccess(addressSuggestion);
        const response = cold('-a|', { a: addressSuggestion });
        const expected: any = hot('------b', { b: completion });

        userService.getAddressSuggestions = jest.fn(() => {
            return response;
        });
        expect(
            effects.loadAddressSuggestions({
                debounce: 20,
                scheduler: Scheduler.get(),
            })
        ).toBeObservable(expected);
    }));

});

