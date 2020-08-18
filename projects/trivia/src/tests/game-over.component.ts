import 'reflect-metadata';
import { GameOverComponent } from '../app/game-play/components/game-over/game-over.component.tns';
import { Utils, WindowRef } from 'shared-library/core/services';
import { nsTestBedBeforeEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from './../app/store';
import { testData } from 'test/data';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';
import { gamePlayState, GamePlayState } from '../app/game-play/store';
import { Game } from 'shared-library/shared/model';
import * as dashboardactions from '../app/dashboard/store/actions';
import * as gameplayactions from '../app/game-play/store/actions';
describe('GameOverComponent', () => {

    let component: GameOverComponent;
    let fixture: ComponentFixture<GameOverComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let user: User;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let mockGamePlaySelector: MemoizedSelector<GamePlayState, Partial<GamePlayState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([GameOverComponent], [
        UserActions,
        WindowRef,

        {
            provide: Utils,
            useValue: {
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    return `~/assets/images/avatar-${size}.png`;
                },
                showMessage(type: string, message: string) {
                    return '';
                },
            }
        },
        provideMockStore({
            selectors: [
                {
                    selector: appState.coreState,
                    value: {}
                },
                {
                    selector: gamePlayState,
                    value: {}
                },
                {
                    selector: appState.dashboardState,
                    value: {}
                },
            ]
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        fixture = await nsTestBedRender(GameOverComponent);
        component = fixture.componentInstance;
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        mockGamePlaySelector = mockStore.overrideSelector<GamePlayState, Partial<GamePlayState>>(appState.gamePlayState, {});
        const dbModel = testData.games[0];
        component.game = Game.getViewModel(dbModel);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('verify if userProfileSaveStatus value is set', (async () => {

        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');

        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        mockCoreSelector.setResult({
            user: testData.userList[0],
            userDict: userDict, userProfileSaveStatus: 'IS FRIEND'
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.disableFriendInviteBtn).toBeTruthy();
        expect(spyMessage).toHaveBeenCalled();
    }));



    it('verify if shareScore() function works correctly', () => {
        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[0], user: testData.userList[0]
        });
        mockStore.refreshState();
        component.shareScore();
        expect(component.loaderStatus).toEqual(true);
        expect(component.playerUserName).toEqual(testData.userList[0].displayName);
    });

    it(`on call ngOnDestroy it should call destroy function `, () => {

        const spyOnDestroy = spyOn(component, 'destroy');

        component.ngOnDestroy();
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);

    });

    it(`on call showDialog it should open dialog `, () => {
        component.showDialog();
        expect(component.dialogOpen).toBeTruthy();
    });

    it(`on call showDialog it should close dialog `, () => {
        component.closeDialog();
        expect(component.dialogOpen).toBeFalsy();
    });

    it(`on call closeDialogReport it should set value to openReportDialog and call handlePopOver`, () => {

        const spyOnHandlePopOver = spyOn(component, 'handlePopOver');
        component.closeDialogReport(true);
        expect(component.openReportDialog).toBeTruthy();
        expect(spyOnHandlePopOver).toHaveBeenCalledTimes(1);
    });

    it(`on call openDialogReport it should open dialog to report question`, () => {
        const question = testData.userAnsweredQuestions[0];
        component.openDialogReport(question);
        expect(component.openReportDialog).toBeTruthy();
        expect(component.reportQuestion).toBe(question);
    });

    it(`on call handlePopOver it should set openReport true for that particular question and for other set false `, () => {
        const question = testData.userAnsweredQuestions[0];
        component.questionsArray = testData.userAnsweredQuestions;
        component.handlePopOver(question);
        expect(component.questionsArray[0].openReport).toBeTruthy();
        expect(component.questionsArray[1].openReport).toBeFalsy();
    });

    it(`on call openDialog it should call handlePopOver to open dialog`, () => {
        const question = testData.userAnsweredQuestions[0];
        const spyOnDestroy = spyOn(component, 'handlePopOver');
        component.openDialog(question);
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);
    });

    it(`on call stackLoaded it should assign object to stackLayout`, () => {
        const arg = { object: '' };
        component.stackLoaded(arg);
        expect(component.stackLayout).toBe(arg.object);
    });

    it(`reMatchGame`, () => {
        const arg = { object: '' };
        component.stackLoaded(arg);
        expect(component.stackLayout).toBe(arg.object);
    });


    it('verify if reMatchGame() function works correctly', () => {
        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[1], user: testData.userList[0]
        });
        mockStore.refreshState();
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        component.reMatchGame();
        expect(spyMessage).toHaveBeenCalled();
    });

    it('verify if reMatchGame() function works correctly if user has more than 0 lives', () => {
        mockCoreSelector.setResult({
            applicationSettings: [testData.applicationSettings],
            account: testData.account[0], user: testData.userList[0]
        });
        mockStore.refreshState();
        const spyOnReMatch = spyOn(component, 'reMatch');
        component.reMatchGame();
        expect(spyOnReMatch).toHaveBeenCalledTimes(1);
    });

    it('On ngOnDestroy called  it should call destroy', () => {
        const spyOnDestroy = spyOn(component, 'destroy').and.returnValue('');
        component.ngOnDestroy();
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);
    });


    // Common Test case



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


    it('verify if getImageUrl function works correctly', () => {
        const services = TestBed.get(Utils);
        const spyGetImageUrl = spyOn(services, 'getImageUrl');
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



});
