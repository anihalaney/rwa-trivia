import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameOverComponent } from './game-over.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils, WindowRef } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { MatSnackBarModule, MatDialog } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { PLATFORM_ID } from '@angular/core';
import * as dashboardactions from '../../../dashboard/store/actions';
import { GamePlayState } from '../../store';
import * as gameplayactions from '../../store/actions';


describe('GameOverComponent', () => {

    let component: GameOverComponent;
    let fixture: ComponentFixture<GameOverComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let mockGamePlaySelector: MemoizedSelector<GamePlayState, Partial<GamePlayState>>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameOverComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                UserActions,
                WindowRef,
                { provide: PLATFORM_ID, useValue: 'browser' },
                {
                    provide: Utils, useValue: {
                        getTimeDifference(turnAt: number) {
                            return 1588313130838 - turnAt;
                        },
                        convertIntoDoubleDigit(digit: Number) {
                            return (digit < 10) ? `0${digit}` : `${digit}`;
                        },
                        getImageUrl(user, width, height, size) {
                            return '';
                        }
                    }
                },
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        },
                        {
                            selector: appState.dashboardState,
                            value: {}
                        },
                        {
                            selector: appState.gamePlayState,
                            value: {}
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule, MatDialogModule]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameOverComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(appState.coreState, {});
        mockGamePlaySelector = mockStore.overrideSelector<GamePlayState, Partial<GamePlayState>>(appState.gamePlayState, {});
        fixture = TestBed.createComponent(GameOverComponent);
        component = fixture.debugElement.componentInstance;
        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set applicationSettings', () => {
        mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
        mockStore.refreshState();
        expect(component.applicationSettings).toEqual(testData.applicationSettings);
    });

    it('on load component should set account', () => {
        mockCoreSelector.setResult({ account: testData.account[0] });
        mockStore.refreshState();
        expect(component.account).toEqual(testData.account[0]);
    });

    it('on load component should set user', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        expect(component.user).toEqual(testData.userList[0]);
    });

    it('verify initial value of socialFeedData', () => {
        expect(component.socialFeedData).toEqual({
            blogNo: 0,
            share_status: false,
            link: ''
        });
    });

    it('verify if LoadSocialScoreShareUrlSuccess action is dispatched successfully', () => {
        expect(spy).toHaveBeenCalledWith(new dashboardactions.LoadSocialScoreShareUrlSuccess(null));
    });

    it('on load component should set userDictionary', () => {
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({ userDict: userDict });
        mockStore.refreshState();
        expect(component.userDict).toBe(userDict);
    });

    it('on load component should set friendInvitation', () => {
        component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict, userFriendInvitations: { 'data6@data.com': testData.invitation }
        });
        mockStore.refreshState();
        expect(component.userInvitations).toEqual({ 'data6@data.com': testData.invitation });
    });

    it('on load component should dispatch loadUserInvitationsInfo', () => {
        component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict, userFriendInvitations: { 'data6@data.com': testData.invitation }
        });
        mockStore.refreshState();
        expect(spy).toHaveBeenCalledWith(new UserActions().loadUserInvitationsInfo(
            testData.userList[0].userId,
            userDict['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].email,
            'yP7sLu5TmYRUO9YT4tWrYLAqxSz1'
        ));
    });

    it('on load component should set userAnsweredQuestion', () => {

        mockGamePlaySelector.setResult({ userAnsweredQuestion: testData.userAnsweredQuestions });
        mockStore.refreshState();
        expect(component.questionsArray).toEqual(testData.userAnsweredQuestions);
    });

    it('verify if the correctAnswerClassIndexIncrement value is correct', () => {
        mockGamePlaySelector.setResult({ userAnsweredQuestion: testData.userAnsweredQuestions });
        mockStore.refreshState();
        expect(component.correctAnswerClassIndexIncrement).toEqual(5);
    });

    it('verify if the bindQuestions() function works correctly', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        component.bindQuestions();
        expect(spy).toHaveBeenCalledWith(new gameplayactions.GetUsersAnsweredQuestion({
            userId: testData.userList[0].userId,
            game: Game.getViewModel(testData.games[0])
        }));
    });

    it('verify if the bindQuestions() function works correctly if the userAnsweredQuestions is empty', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockGamePlaySelector.setResult({ userAnsweredQuestion: testData.userAnsweredQuestions });
        mockStore.refreshState();
        component.bindQuestions();
        expect(spy).not.toHaveBeenCalledWith(new gameplayactions.GetUsersAnsweredQuestion({
            userId: testData.userList[0].userId,
            game: Game.getViewModel(testData.games[0])
        }));
    });

    it('verify if the rematch() function works correctly', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        component.reMatch();
        expect(component.socialFeedData.share_status).toEqual(false);
        expect(component.disableRematchBtn).toEqual(true);
        expect(component.game.gameOptions.rematch).toEqual(true);
        expect(spy).toHaveBeenCalledWith(new gameplayactions.CreateNewGame({
            user: testData.userList[0],
            gameOptions: Game.getViewModel(testData.games[0]).gameOptions
        }));
    });

    it('verify if getImageUrl function works correctly', () => {
        component.utils.getImageUrl = jest.fn();
        component.getImageUrl(testData.userList[0]);
        expect(component.utils.getImageUrl).toHaveBeenCalledTimes(1);
    });

    it('verify if inviteAsFriend function works correctly', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        component.disableFriendInviteBtn = false;
        component.inviteAsFriend();
        expect(spy).toHaveBeenCalledWith(new UserActions().addUserInvitation({
            userId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2',
            inviteeUserId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1'
        }));
    });

    it('verify if inviteAsFriend function works correctly if disableFriendInviteBtn is true', () => {
        mockCoreSelector.setResult({ user: testData.userList[0] });
        mockStore.refreshState();
        component.disableFriendInviteBtn = true;
        component.inviteAsFriend();
        expect(spy).not.toHaveBeenCalledWith(new UserActions().addUserInvitation({
            userId: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2',
            inviteeUserId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1'
        }));
    });

    it('verify if continueButtonClicked function works correctly', () => {
        const gameContinueSpy = spyOn(component.gameOverContinueClicked, 'emit');
        component.continueButtonClicked({});
        expect(gameContinueSpy).toHaveBeenCalledTimes(1);
    });

    it('verify if ngOnChanges works correctly', () => {
        component.earnedBadges = testData.games[0].stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge;
        component.earnedBadgesByOtherUser = testData.games[0].stats['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].badge;
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict
        });
        mockStore.refreshState();
        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
        component.ngOnChanges({
            game:
            {
                previousValue: undefined,
                currentValue: component.game,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        expect(component.otherUserId).toEqual('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.otherUserInfo).toEqual(testData.userList[1]);
        expect(component.gameStatus).toEqual(0);
    });

    it('verify if ngOnChanges works correctly for game lost', () => {
        component.earnedBadges = testData.games[1].stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge;
        component.earnedBadgesByOtherUser = testData.games[1].stats['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].badge;
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict
        });
        mockStore.refreshState();
        const dbModel = testData.games[1];
        component.game = Game.getViewModel(dbModel);
        component.ngOnChanges({
            game:
            {
                previousValue: undefined,
                currentValue: component.game,
                firstChange: true,
                isFirstChange: undefined
            }
        });

        expect(component.gameStatus).toEqual(1);
    });

    it('verify if ngOnChanges works correctly for single player game won', () => {
        component.earnedBadges = testData.games[2].stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge;
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict
        });
        mockStore.refreshState();
        const dbModel = testData.games[2];
        component.game = Game.getViewModel(dbModel);
        component.ngOnChanges({
            game:
            {
                previousValue: undefined,
                currentValue: component.game,
                firstChange: true,
                isFirstChange: undefined
            }
        });

        expect(component.gameStatus).toEqual(0);
    });

    it('verify if ngOnChanges works correctly for single player game tie', () => {
        component.earnedBadges = testData.games[16].stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge;
        component.earnedBadgesByOtherUser = testData.games[16].stats['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].badge;
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict
        });
        mockStore.refreshState();
        const dbModel = testData.games[16];
        component.game = Game.getViewModel(dbModel);
        component.ngOnChanges({
            game:
            {
                previousValue: undefined,
                currentValue: dbModel,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        expect(component.gameStatus).toEqual(2);
    });

    it('verify if ngOnChanges works correctly for single player game draw', () => {
        component.earnedBadges = testData.games[17].stats['4kFa6HRvP5OhvYXsH9mEsRrXj4o2'].badge;
        component.earnedBadgesByOtherUser = testData.games[17].stats['yP7sLu5TmYRUO9YT4tWrYLAqxSz1'].badge;
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict
        });
        mockStore.refreshState();
        const dbModel = testData.games[17];
        component.game = Game.getViewModel(dbModel);
        component.ngOnChanges({
            game:
            {
                previousValue: undefined,
                currentValue: dbModel,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        expect(component.gameStatus).toEqual(3);
    });

    it('verify if onNotify() function works correctly', () => {
        component.onNotify({ share_status: 'testData' });
        expect(component.socialFeedData.share_status).toEqual('testData');
    });

    it('verify if reMatchGame() function works correctly', () => {
        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[1], user: testData.userList[0]
        });
        mockStore.refreshState();
        component.snackBar.open = jest.fn();
        component.reMatchGame();
        expect(component.snackBar.open).toHaveBeenCalledTimes(1);
    });

    it('verify if reMatchGame() function works correctly if user has more than 0 lives', () => {
        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[0], user: testData.userList[0]
        });
        mockStore.refreshState();
        component.reMatch = jest.fn();
        component.reMatchGame();
        expect(component.reMatch).toHaveBeenCalledTimes(1);
    });

    it('verify if shareScore() function works correctly', () => {

        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[0], user: testData.userList[0]
        });

        mockStore.refreshState();
        component.shareScore();
        expect(component.loaderStatus).toEqual(true);
        expect(component.playerUserName).toEqual(testData.userList[0].displayName);

        expect(component.playerUserName).toEqual('Priyanka 124');

    });

    it('verify if reportQuestion() function works correctly', (async () => {

        component.openDialog = jest.fn();
        component.reportQuestion({});
        jest.setTimeout(0);
        await new Promise((r) => setInterval(r, 0));
        expect(component.openDialog).toHaveBeenCalledTimes(1);

    }));

    it('verify if userProfileSaveStatus value is set', (async () => {
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict, userProfileSaveStatus: 'IS FRIEND'
        });
        component.snackBar.open = jest.fn();
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.snackBar.open).toHaveBeenCalledTimes(2);


    }));


    afterEach(() => {
        fixture.destroy();
    });

});
