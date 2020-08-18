import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { DashboardComponent } from './../app/dashboard/component/dashboard/dashboard.component.tns';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, ActionWithPayload, categoryDictionary } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { testData } from 'test/data';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { TimeAgoPipe } from 'time-ago-pipe';
import { RouterExtensions } from 'nativescript-angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DOCUMENT } from '@angular/common';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game, PlayerMode, GameStatus, OpponentType, Invitation } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { DashboardState } from './../app/dashboard/store';
import { Router } from '@angular/router';



describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let user: User;
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
    let mockCategorySelector: MemoizedSelector<any, {}>;
    let mockDashboardSelector: MemoizedSelector<AppState, Partial<DashboardState>>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [DashboardComponent, TimeAgoPipe],
        [GameActions, UserActions, QuestionActions,
            {
                provide: Utils, useValue: {
                    getImageUrl(member: User, width: Number, height: Number, size: string) {
                        return `assets/images/avatar-${size}.png`;
                    },
                    getUTCTimeStamp() {
                        return 1590744019740;
                    },
                    convertMilliSIntoMinutes(millis: any) {
                        return millis / 60000;
                    },
                    getTimeDifference(pastTime: number, currentTime?: number) {
                        const diff = currentTime - pastTime;
                        return diff;
                    },
                    convertIntoDoubleDigit(digit: Number) {
                        return (digit < 10) ? `0${digit}` : `${digit}`;
                    }
                }
            },
            provideMockStore({
                initialState: {},
                selectors: [
                    {
                        selector: appState.coreState,
                        value: {
                        }
                    },
                    {
                        selector: appState.dashboardState,
                        value: {

                        }
                    }
                ]
            }), {
                provide: WindowRef, useValue: {
                    nativeWindow: () => {
                        return {
                            innerWidth: 0
                        };
                    }
                }
            }
            // RouterExtensions
            // ,  {
            //     // DOCUMENT must be injected manually for RouterTestingModule to work.
            //     provide: DOCUMENT,
            //     useClass: NativeScriptDocument,
            // },
        ],
        [ReactiveFormsModule, NativeScriptFormsModule, StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(DashboardComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
        mockDashboardSelector = mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {});

        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set userDict when store emit userDict', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        mockCoreSelector.setResult({ userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.userDict).toEqual(userDict);
    });

    it('On load component should set applicationSettings and account', () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ applicationSettings, account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSettings[0]);
        expect(component.account).toEqual(user.account);
    });

    it('on call navigateToMyQuestion function it should navigate', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToMyQuestion();
        expect(navigateSpy).toHaveBeenCalledTimes(1);

    });

    it('on call gotToNotification function it should navigate to notification', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.gotToNotification();
        expect(navigateSpy).toHaveBeenCalledWith(['/notification'], undefined);
    });

    it('on call navigateToProfileSettings function it should navigate to user/my/profile', () => {
        const navigateSpy = spyOn(router, 'navigate');
        user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();
        component.navigateToProfileSettings();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/profile', '4kFa6HRvP5OhvYXsH9mEsRrXj4o2'], undefined);
    });

    it('on call navigateToCategories function it should navigate to /update-category-tag', () => {
        const navigateSpy = spyOn(router, 'navigate');
        user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();
        component.navigateToCategories();
        expect(navigateSpy).toHaveBeenCalledWith(['/update-category-tag'], undefined);
    });

    it('on call navigateToCategories function it should navigate to /login when user is not logged in', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToCategories();
        expect(navigateSpy).toHaveBeenCalledWith(['/login'], { clearHistory: true });
    });

    it('On ngOnDestroy called  it should set renderView to false', () => {
        component.ngOnDestroy();
        expect(component.renderView).toBeFalsy();
    });

    it('On load component should set photoUrl', () => {
        user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ user });
        expect(component.photoUrl).toEqual('assets/images/avatar-70X60.png');
    });

    it('On load component should set categoryDict', () => {
        const categoryDict = testData.categoryDictionary;
        mockCategorySelector.setResult(categoryDict);
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categoryDict).toEqual(categoryDict);
    });

    it(`On load component should set 'user, user actionText, user actionSubText and showNewsCard'
     and also dispatched getActiveGames and loadGameInvites`, () => {
        user = { ...testData.userList[0] };
        const categoryDict = testData.categoryDictionary;
        mockCategorySelector.setResult(categoryDict);
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        expect(component.user).toEqual(user);
        expect(component.actionText).toEqual(`Hi ${user.displayName}`);
        const topicsList = [
            ...user.tags,
            ...user.categoryIds
                .map(id =>
                    categoryDict[id] ? categoryDict[id].categoryName : ''
                )
                .filter(name => name !== '')
        ];
        const expectedSubText = topicsList.join(', ');
        expect(component.actionSubText).toEqual(expectedSubText);
        expect(component.showNewsCard).toEqual(user && user.isSubscribed ? false : true);
        // Dispatched getActiveGames and loadGameInvites
        expect(spy).toHaveBeenCalledWith(
            new GameActions().getActiveGames(user)
        );
        expect(spy).toHaveBeenCalledWith(
            new UserActions().loadGameInvites(user)
        );
    });

    it('On load component should set applicationSettings and account', () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ applicationSettings, account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSettings[0]);
        expect(component.account).toEqual(user.account);
    });

    it(`gamePlayBtnDisabled should be 'false' when there is no lives in applicationSettings`, () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [...[testData.applicationSettings]];

        applicationSettings[0].lives.enable = false;
        mockCoreSelector.setResult({ applicationSettings, account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.gamePlayBtnDisabled).toBe(false);
    });

    it(`gamePlayBtnDisabled should be 'false' when account is enable`, () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [...[testData.applicationSettings]];
        user.account.enable = true;
        mockCoreSelector.setResult({ applicationSettings, account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.gamePlayBtnDisabled).toBe(false);
    });

    it(`gamePlayBtnDisabled should be 'true' when account is not enable and lives is 0`, () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        applicationSettings[0].lives.enable = true;
        user.account.enable = false;
        user.account.lives = 0;
        mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
        mockStore.refreshState();
        expect(component.gamePlayBtnDisabled).toBe(true);
    });

    it('On load component should set serverCreatedTime when store emit questionOfTheDay', () => {
        const questionOfTheDay = testData.questionOfTheDay;
        mockCoreSelector.setResult({ questionOfTheDay });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.serverCreatedTime).toEqual(questionOfTheDay.serverTimeQCreated);
    });

    it('On load component should set userDict when store emit userDict', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        mockCoreSelector.setResult({ userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.userDict).toEqual(userDict);
    });

    it('On load component should set activeGames when store emit activeGames', () => {
        user = { ...testData.userList[0] };
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ activeGames: games, user });
        mockStore.refreshState();
        expect(component.activeGames).toEqual(games);
    });

    it('Verify singlePlayerCount when game option palyer mode is single', () => {
        user = { ...testData.userList[0] };
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ activeGames: games, user });
        mockStore.refreshState();
        let totalSinglePlayer = 0;
        games.map((game) => {
            if (
                Number(game.gameOptions.playerMode) ===
                Number(PlayerMode.Single) &&
                game.playerIds.length === 1
            ) {
                totalSinglePlayer++;
            }
        });
        expect(component.singlePlayerCount).toEqual(totalSinglePlayer);
    });

    it('Verify theirTurnCount when nextTurnPlayerId and current userId not same and GameStatus is `waiting for next question`', () => {
        user = { ...testData.userList[0] };
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ activeGames: games, user });
        mockStore.refreshState();
        let theirTurnCount = 0;
        games.map((game) => {
            if (
                game.nextTurnPlayerId !== user.userId &&
                game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q
            ) {
                theirTurnCount++;
            }
        });
        expect(component.theirTurnCount).toEqual(theirTurnCount);
    });

    it('Verify twoPlayerCount when game option player mode is Opponent and nextTurnPlayerId is same as current userID', () => {
        user = { ...testData.userList[0] };
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ activeGames: games, user });
        mockStore.refreshState();
        let twoPlayerCount = 0;
        games.map((game) => {
            if (
                Number(game.gameOptions.playerMode) ===
                Number(PlayerMode.Opponent) &&
                game.nextTurnPlayerId === user.userId
            ) {
                twoPlayerCount++;
            }
        });
        expect(component.twoPlayerCount).toEqual(twoPlayerCount);
    });

    it(`Verify waitingForOpponentCount when GameStatus is 'available for opponent || joined opponent
    || waiting for friend invitation acceptance || waiting for random player invitation acceptance'`, () => {
        user = { ...testData.userList[0] };
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ activeGames: games, user });
        mockStore.refreshState();
        let waitingForOpponentCount = 0;
        games.map((game) => {
            if (
                game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
                game.GameStatus === GameStatus.JOINED_GAME ||
                game.GameStatus ===
                GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
                game.GameStatus ===
                GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE
            ) {
                waitingForOpponentCount++;
            }
        });
        expect(component.waitingForOpponentCount).toEqual(waitingForOpponentCount);
    });

    it('On load component should set gameInvites when store emit gameInvites', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ gameInvites: games });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.gameInvites).toEqual(games);
    });

    it('Verify friendCount when game options opponent type is Friend', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ gameInvites: games });
        mockStore.refreshState();
        let friendCount = 0;
        games.map((iGame) => {
            if (
                Number(iGame.gameOptions.opponentType) === OpponentType.Friend
            ) {
                friendCount++;
            }
        });
        expect(component.friendCount).toEqual(friendCount);
    });

    it('Verify randomPlayerCount when game options opponent type is Random', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockCoreSelector.setResult({ gameInvites: games });
        mockStore.refreshState();
        let randomPlayerCount = 0;
        games.map((iGame) => {
            if (
                Number(iGame.gameOptions.opponentType) === OpponentType.Random
            ) {
                randomPlayerCount++;
            }
        });
        expect(component.randomPlayerCount).toEqual(randomPlayerCount);
    });

    it('On load component should set friendInvitations when store emit friendInvitations', () => {
        const friendInvitations: Invitation[] = [];
        friendInvitations.push(testData.invitation);
        mockCoreSelector.setResult({ friendInvitations });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.friendInvitations).toEqual(friendInvitations);
    });

    it('On load component should set notifications when store emit friendInvitations and gameInvites', () => {
        const friendInvitations: Invitation[] = [];
        friendInvitations.push(testData.invitation);
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            friendInvitations, gameInvites: games
        });
        mockStore.refreshState();
        fixture.detectChanges();
        const notify: any[] = [friendInvitations, games];
        const expectedResult = notify[0].concat(notify[1]);
        expect(component.notifications).toEqual(expectedResult);
    });

    it('On load component should set yourQuestion when store emit userLatestPublishedQuestion', () => {
        const latestPublishedQuestion = testData.question;
        mockDashboardSelector.setResult({ userLatestPublishedQuestion: latestPublishedQuestion });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.yourQuestion).toEqual(latestPublishedQuestion);
        expect(component.yourQuestion.toggleButton).toBe(false);
    });

    it('Check isLivesEnable function return value', () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        applicationSettings[0].lives.enable = true;
        mockCoreSelector.setResult({
            user,
            applicationSettings,
            account: user.account,
        });
        mockStore.refreshState();
        expect(component.isLivesEnable).toBe(true);
    });



    it('Verify remainingMinutes and remainingSeconds in gameLives function and also dispatch add UserLives action', (async () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings });
        mockStore.refreshState();

        await new Promise((r) => setTimeout(r, 2000));
        expect(component.remainingMinutes).toBe('01');
        expect(component.remainingSeconds).toBe('13');
        expect(spy).toHaveBeenCalledWith(
            new UserActions().addUserLives(user.userId)
        );
    }));

    it('Verify timeoutLive in gameLives function', (async () => {
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings });
        mockStore.refreshState();
        component.serverCreatedTime = 1580744019740;

        await new Promise((r) => setTimeout(r, 2000));
        expect(component.timeoutLive).toBe('31:112');
    }));


    it('Verify startNewGame function when applicationSettings lives is not enabled then navigation should not clear history ', () => {
        const navigateSpy = spyOn(router, 'navigate');
        const applicationSettings: any[] = [{ ...testData.applicationSettings }];
        applicationSettings[0].lives.enable = false;
        mockCoreSelector.setResult({ applicationSettings });
        mockStore.refreshState();
        fixture.detectChanges();
        component.startNewGame('Two');
        expect(navigateSpy).toHaveBeenCalledWith(['/game-play/game-options', 'Two'], undefined);
    });

    it('Verify startNewGame function for Single player mode', () => {
        const navigateSpy = spyOn(router, 'navigate');
        user = { ...testData.userList[0] };
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        user.account.lives = 3;
        applicationSettings[0].lives.enable = true;
        mockCoreSelector.setResult({ account: user.account, applicationSettings });
        mockStore.refreshState();
        fixture.detectChanges();
        component.startNewGame('Single');
        expect(navigateSpy).toHaveBeenCalledWith(['/game-play/game-options', 'Single'], { clearHistory: true });
    });
    it('Verify startNewGame function for Two player mode', () => {
        const navigateSpy = spyOn(router, 'navigate');
        user = { ...testData.userList[0] };
        user.account.lives = 3;
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        applicationSettings[0].lives.enable = true;
        mockCoreSelector.setResult({ account: user.account, applicationSettings });
        mockStore.refreshState();
        fixture.detectChanges();
        component.startNewGame('Two');
        expect(navigateSpy).toHaveBeenCalledWith(['/game-play/game-options', 'Two'], { clearHistory: true });
    });

    it('Verify startNewGame function when user account detail is not available then navigate it', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.applicationSettings = testData.applicationSettings;
        component.applicationSettings.lives.enable = true;
        fixture.detectChanges();
        component.startNewGame('Two');
        expect(navigateSpy).toHaveBeenCalledWith(['/game-play/game-options', 'Two'], { clearHistory: true });
    });

});
