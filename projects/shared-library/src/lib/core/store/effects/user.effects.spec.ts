import { Observable } from 'rxjs';
import { GameService, UserService, Utils } from 'shared-library/core/services';
import { TestBed, async } from '@angular/core/testing';
import { UserActions } from '../actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { hot, cold } from 'jest-marbles';
import { testData } from 'test/data';
import { User, Game } from 'shared-library/shared/model';
import { UserEffects } from './user.effects';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, ActionWithPayload } from 'shared-library/core/store';
import { empty, of } from 'rxjs';
import { Invitation, DrawerConstants } from '../../../shared/model';
import { debounce, debounceTime } from 'rxjs/operators';


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
                    initialState: {'core': {}},
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
        const user: User = testData.userList[0];
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

    it('Load user account', () => {
        const user: User = testData.userList[0];
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

    // TODO: Remain write unit test
    // loadOtherUserProfile
    it('Load other user profile', () => {
        const user: User = testData.userList[0];
        // mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, user);
        // mockCoreSelector.setResult({ user });
        // mockStore.refreshState();
        const action = new UserActions().loadOtherUserProfile(user.userId);
        const completion = new UserActions().loadOtherUserProfileSuccess(user);
        // console.log('user tester????', completion);
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

        // effects.loadOtherUserProfile$.subscribe(res => {
        //     expect(res).toMatchObject(completion);
        //     expect(spy).toHaveBeenCalledTimes(1);
        //     // done();
        // });
    });

    // TODO: Remain write unit test
    // loadOtherUserExtendedInfo
    // it('Load other user exiended info', () => {
    //     const user: User = testData.userList[0];
    //     const action = new UserActions().loadOtherUserExtendedInfo(user.userId);
    //     const completion = new UserActions().loadOtherUserProfileWithExtendedInfoSuccess(user);
    //     // mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, (user));
    //     // mockStore.refreshState();
    //     actions$ = hot('-a---', { a: action });
    //     const response = cold('-a|', { a: user.account });
    //     const expected = cold('--b', { b: completion });
    //     userService.loadOtherUserProfileWithExtendedInfo = jest.fn(() => {
    //         return response;
    //     });
    //     expect(effects.loadOtherUserExtendedInfo$).toBeObservable(expected);
    // });


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

    // TODO Need to write unit test
    // // loadFriendInvitations
    // it('loadFriendInvitations', () => {
    //     const gameId = testData.games[0].gameId;
    //     const action = new UserActions().rejectGameInvitation(gameId);
    //     const completion = new UserActions().updateGameSuccess();

    //     expect(effects.loadFriendInvitations$).toBeObservable(expected);
    // });

    // UpdateInvitation
    it('UpdateInvitation', () => {
        const invitedUser: User = testData.userList[1];
        const invited: Invitation = {
            created_uid: user.userId,
            email: invitedUser.email,
            id: 'OYXPXnqU2ua2mwXlbRHT',
            status: 'pending'
        };

        const action = new UserActions().updateInvitation(invited);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: '' });
        const expected = cold('--b', { b: '' });
        userService.setInvitation = jest.fn(() => {
            return response;
        });
        expect(effects.UpdateInvitation$).toBeObservable(expected);
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

    // // loadAddressSuggestions
    // it('loadAddressSuggestions', () => {
    //     const location = 'Ahme';
    //     const addressSuggestion = [testData.addressSuggestion];
    //     const action = new UserActions().loadAddressSuggestions(location);
    //     const completion = new UserActions().loadAddressSuggestionsSuccess(addressSuggestion);

    //     actions$ = hot('-a---', { a: action });
    //     const response = cold('-a|', { a: addressSuggestion });
    //     const expected = cold('--b', { b: completion });

    //     userService.getAddressSuggestions = jest.fn(() => {
    //         return response;
    //     });
    //     expect(effects.loadAddressSuggestions).toBeObservable(expected);
    // });


    // checkDisplayName
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

});
