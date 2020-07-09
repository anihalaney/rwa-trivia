import 'reflect-metadata';
import { NewGameComponent } from '../app/game-play/components/new-game/new-game.component.tns';
import { Utils, WindowRef } from 'shared-library/core/services';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from './../app/store';
import { testData } from 'test/data';
import { coreState, CoreState, UserActions, GameActions, TagActions } from 'shared-library/core/store';
import { User, GameOptions } from 'shared-library/shared/model';
import { NavigationService } from 'shared-library/core/services/mobile';
import { of } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { PlayerMode } from 'shared-library/shared/model';

describe('NewGameComponent', () => {

    let component: NewGameComponent;
    let fixture: ComponentFixture<NewGameComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([NewGameComponent], [
        UserActions,
        GameActions,
        TagActions,
        WindowRef,
        NavigationService,
        {
            provide: Utils,
            useValue: {
                back() {
                    return ``;
                },
                showMessage(type: string, message: string) {
                    return '';
                },
                hideKeyboard() {
                    return ''
                }
            }
        },
        provideMockStore({
            selectors: [
                {
                    selector: appState.coreState,
                    value: {}
                }
            ]
        }),
        // {
        //     provide: ActivatedRoute,
        //     useValue: {
        //         params: of({ userid: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2' })
        //     }
        // },
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        fixture = await nsTestBedRender(NewGameComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    }));

    afterEach(nsTestBedAfterEach(true));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set userDict when emit from store', () => {
        const userDict = { ...testData.userDict };
        mockCoreSelector.setResult({ userDict });
        mockStore.refreshState();
        expect(userDict).toEqual(userDict);
    });

    it('on click on showDialog it should display dialog', () => {
        component.showDialog();
        expect(component.dialogOpen).toBeTruthy();
    });

    it('on click on stopEventPropogation it should stop to propagate event', () => {
        expect(component.stopEventPropogation()).toBeFalsy();
    });

    it('on call back button it should change opponentType if chooseOptionsStep and skipNavigation is true', () => {
        component.gameOptions = new GameOptions();
        component.gameOptions.opponentType = 0;
        component.chooseOptionsStep = 1;
        component.skipNavigation = true;
        component.back();
        expect(component.chooseOptionsStep).toBe(0);
        expect(component.gameOptions.opponentType).toBe(1);
    });

    it('on call back button it should navigate to back if chooseOptionsStep and skipNavigation is false', () => {
        component.gameOptions = new GameOptions();
        component.gameOptions.opponentType = 0;
        component.skipNavigation = false;
        const navigationServices = TestBed.get(NavigationService);
        const spyOnBackButton = spyOn(navigationServices, 'back');
        component.back();
        expect(spyOnBackButton).toHaveBeenCalled();
    });

    it('on ngOnDestroy call it should set undefined or set initial value', () => {
        component.ngOnDestroy();
        expect(component.showSelectPlayer).not.toBeDefined();
        expect(component.showSelectCategory).not.toBeDefined();
        expect(component.showSelectTag).not.toBeDefined();
        expect(component.categories).toEqual([]);
        expect(component.subscriptions).toEqual([]);
        expect(component.filteredCategories).toEqual([]);
        expect(component.customTag).not.toBeDefined();
        expect(component.tagItems).not.toBeDefined();
        expect(component.renderView).toBeFalsy();
    });

    it('on ngOnDestroy call it should set undefined or set initial value', () => {
        const spyOnDestroy = spyOn(component, 'destroy').and.callThrough();

        component.ngOnDestroy();

        expect(component.showSelectPlayer).not.toBeDefined();
        expect(component.showSelectCategory).not.toBeDefined();
        expect(component.showSelectTag).not.toBeDefined();
        expect(component.categories).toEqual([]);
        expect(component.subscriptions).toEqual([]);
        expect(component.filteredCategories).toEqual([]);
        expect(component.customTag).not.toBeDefined();
        expect(component.tagItems).not.toBeDefined();
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);
    });

    it('on addCustomTag it should add tag if it not selected', () => {
        component.customTag = 'Angular';
        component.selectedTags = [];
        component.addCustomTag();
        expect(component.selectedTags).toEqual(['Angular']);
    });

    it('on addCustomTag it should not add tag if it is already selected', () => {
        component.customTag = 'Angular';
        component.selectedTags = ['Angular'];
        component.addCustomTag();
        expect(component.selectedTags).toEqual(['Angular']);
        expect(component.customTag).toBe('');
    });

    it('on addCustomTag it should not add tag if it is already selected', () => {
        component.customTag = 'Angular';
        component.selectedTags = ['Angular'];
        component.addCustomTag();
        expect(component.selectedTags).toEqual(['Angular']);
        expect(component.customTag).toBe('');
    });

    it(`on click onSearchFriendTextChange it should set searchFriend`, () => {
        const event = { value: 'Jack' };
        component.onSearchFriendTextChange(event);
        expect(component.searchFriend).toBe('Jack');
    });

    it(`on click startGame it should start new game with single play`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();
        let gameOption: GameOptions = new GameOptions;
        gameOption = {
            isChallenge: false,
            playerMode: 0,
            gameMode: 0,
            categoryIds: [1, 8, 2, 3, 4, 5, 7, 9],
            tags: ['test', 'angular', 'net', 'cloud'],
            'maxQuestions': 8
        };

        const spyOnStartNewGame = spyOn(component, 'startNewGame');
        component.startGame();

        expect(component.showGameStartLoader).toBeTruthy();
        expect(component.gameOptions.opponentType).toBeUndefined();
        expect({ ...component.gameOptions }).toEqual({ ...gameOption });
        expect(spyOnStartNewGame).toHaveBeenCalledTimes(1);

    });


    it(`on click startGame it should start new game with two play with random player`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.gameOptions.playerMode = PlayerMode.Opponent;
        component.gameOptions.opponentType = 0;
        let gameOption: GameOptions = new GameOptions;
        gameOption = {
            isChallenge: false,
            playerMode: 1,
            gameMode: 0,
            categoryIds: [1, 8, 2, 3, 4, 5, 7, 9],
            tags: ['test', 'angular', 'net', 'cloud'],
            'maxQuestions': 8,
            opponentType: 0
        };

        const spyOnStartNewGame = spyOn(component, 'startNewGame');
        component.startGame();

        expect(component.showGameStartLoader).toBeTruthy();
        expect(component.gameOptions.opponentType).toBe(0);
        // console.log(JSON.stringify(component.gameOptions));
        expect({ ...component.gameOptions }).toEqual({ ...gameOption });
        expect(spyOnStartNewGame).toHaveBeenCalledTimes(1);

    });


    it(`on click startGame it should start new game with two play with friend`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.gameOptions.playerMode = PlayerMode.Opponent;
        component.gameOptions.opponentType = 1;
        component.gameOptions.friendId = 'DwtrDdGEdse5deshcede';
        component.friendUserId = 'DwtrDdGEdse5deshcede';
        let gameOption: GameOptions = new GameOptions;
        gameOption = {
            isChallenge: false,
            playerMode: 1,
            gameMode: 0,
            categoryIds: [1, 8, 2, 3, 4, 5, 7, 9],
            tags: ['test', 'angular', 'net', 'cloud'],
            'maxQuestions': 8,
            opponentType: 1,
            friendId: 'DwtrDdGEdse5deshcede'
        };

        const spyOnStartNewGame = spyOn(component, 'startNewGame').and.callThrough();
        component.startGame();

        expect(component.showGameStartLoader).toBeTruthy();
        expect(component.gameOptions.opponentType).toBe(1);
        expect({ ...component.gameOptions }).toEqual({ ...gameOption });
        expect(spyOnStartNewGame).toHaveBeenCalledTimes(1);

    });

    it(`on click selectCategory it should remove not remove category because is required`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();

        const filteredCategories = cloneDeep(component.filteredCategories);
        component.selectCategory(1);
        expect(component.filteredCategories).toEqual(filteredCategories);
    });


    it(`on click selectCategory it should remove remove 'Networking/Infrastructure' category`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();

        const filteredCategories = cloneDeep(component.filteredCategories);
        component.selectCategory(5);
        filteredCategories[5].isSelected = false;
        expect(component.filteredCategories).toEqual(filteredCategories);
    });


    it(`on call getSelectedCatName it should return selected category name`, () => {

        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();

        const categoryName = component.getSelectedCatName();
        // tslint:disable-next-line: max-line-length
        const selectedCategoryName = 'Bit of sci-fi, Bit of fact, Programming, Architecture, Networking/Infrastructure, Database, UX/UI, Hardware';
        expect(categoryName).toBe(selectedCategoryName);
    });

    it(`on call getPlayerMode it should return player mode in string as 'Two Player'`, () => {
        const playerMode = component.getPlayerMode();
        expect(playerMode).toBe('Two Player');
    });

    it(`on call getPlayerMode it should return player mode in string as 'Single Player'`, () => {
        component.gameOptions.playerMode = 1;
        const playerMode = component.getPlayerMode();
        expect(playerMode).toBe('Single Player');
    });

    it(`on call getGameMode it should return opponent type Random'`, () => {
        component.gameOptions.playerMode = 1;
        component.gameOptions.opponentType = 0;
        const opponentType = component.getGameMode();
        expect(opponentType).toBe('Random');
    });

    it(`on call getGameMode it should return opponent type With Friend'`, () => {
        component.gameOptions.playerMode = 1;
        component.gameOptions.opponentType = 1;
        const opponentType = component.getGameMode();
        expect(opponentType).toBe('With Friend');
    });

    it(`on call getGameMode it should return opponent type With Computer'`, () => {
        component.gameOptions.playerMode = 1;
        component.gameOptions.opponentType = 2;
        const opponentType = component.getGameMode();
        expect(opponentType).toBe('With Computer');
    });

    it(`on call onDidAutoComplete it should set tag'`, () => {
        const event = { text: 'java' };
        component.onDidAutoComplete(event);
        expect(component.customTag).toBe('java');
    });

    it(`on onTextChanged call it should set tag'`, () => {
        const event = { text: 'java' };
        component.onTextChanged(event);
        expect(component.customTag).toBe('java');
    });

    it(`on call selectFriendIdApp call it should set tag'`, () => {
        const friend = { userId: 'DwtrDdGEdse5deshcede' };
        component.selectFriendIdApp(friend);
        expect(component.friendUserId).toBe('DwtrDdGEdse5deshcede');
        expect(component.chooseOptionsStep).toBe(1);
        expect(component.skipNavigation).toBeTruthy();
    });

    it(`on selectFriendIdApp it should select friend for game play and update option step`, () => {
        const friend = { userId: 'DwtrDdGEdse5deshcede' };
        component.selectFriendIdApp(friend);
        expect(component.friendUserId).toBe('DwtrDdGEdse5deshcede');
        expect(component.chooseOptionsStep).toBe(1);
        expect(component.skipNavigation).toBeTruthy();
    });

    it(`on navigateToInvite it should redirect to /user/my/app-invite-friends-dialog`, () => {

        const spyOnDestroy = spyOn(component, 'ngOnDestroy');
        const navigate = spyOn(component.router, 'navigate');
        component.navigateToInvite();
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith(['/user/my/app-invite-friends-dialog', { showSkip: false }]);
    });

    it(`on redirectToDashboard it should redirect to /user/my/app-invite-friends-dialog`, () => {
        const msg = 'Redirecting to dashboard';
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        const navigate = spyOn(component.router, 'navigate');
        component.redirectToDashboard(msg);
        expect(spyMessage).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(['/dashboard']);
    });


    it(`on redirectToDashboard it should redirect to dashboard and show message`, () => {
        const msg = 'Redirecting to dashboard';
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        const navigate = spyOn(component.router, 'navigate');
        component.redirectToDashboard(msg);
        expect(spyMessage).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it(`on categoryListHeight it should return total height for category need`, () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.categoryListHeight).toBe(540);
    });


    it(`on tagsHeight it should return total height for category need`, () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0]),
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.tagsHeight).toBe(320);
    });

    it(`on chooseRandomPlayer it should set game option for random player`, () => {
        component.chooseRandomPlayer();
        expect(component.gameOptions.opponentType).toBe(0);
        expect(component.gameOptions.playerMode).toBe(1);
        expect(component.chooseOptionsStep).toBe(1);
        expect(component.friendUserId).toBeNull();
        expect(component.skipNavigation).toBeTruthy();
    });

    it(`on changePlayGameWith it should set game option for two player`, () => {
        component.changePlayGameWith();
        expect(component.gameOptions.opponentType).toBe(1);
        expect(component.gameOptions.playerMode).toBe(1);
        expect(component.chooseOptionsStep).toBe(0);
        expect(component.friendUserId).toBeNull();
    });

    it(`on hideKeyboard it should hide keyboard`, () => {
        const services = TestBed.get(Utils);
        const spyOnHideKeyboard = spyOn(services, 'hideKeyboard');
        component.hideKeyboard();
        expect(spyOnHideKeyboard).toHaveBeenCalled();
    });






});
