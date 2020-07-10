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
import { User, GameOptions, userCardType } from 'shared-library/shared/model';
import { NavigationService } from 'shared-library/core/services/mobile';
import { of } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { PlayerMode } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import * as gameplayactions from '../app/game-play/store/actions';

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
        {
            provide: WindowRef,
            useValue: {
                nativeWindow: {
                    scrollTo: (height, width) => {
                        return '';
                    }
                }
            }
        },
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
                    return '';
                },
                regExpEscape(s: string) {
                    return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
                        replace(/\x08/g, '\\x08');
                },
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    return '';
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
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        fixture = await nsTestBedRender(NewGameComponent);
        component = fixture.componentInstance;
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        component.userCardType = userCardType;
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



    it('On call initDataItems should set tagItems', () => {
        const tagList = ['java', 'c'];
        component.tags = tagList;
        component.initDataItems();
        const tagItems = new ObservableArray<TokenModel>();
        for (let i = 0; i < tagList.length; i++) {
            tagItems.push(new TokenModel(tagList[i], undefined));
        }
        expect(component.tagItems).toEqual(tagItems);
    });


    // Common Test case

    it('initial values should be empty', () => {
        expect(component.categories).toBe(undefined);

        expect(component.tags).toBe(undefined);
        expect(component.selectedTags).toEqual([]);
        expect(component.applicationSettings).toBe(undefined);

        expect(component.gameOptions).toEqual(new GameOptions());

        expect(component.showUncheckedCategories).toBe(false);

        expect(component.allCategoriesSelected).toBe(true);

        expect(component.uFriends).toBe(undefined);

        expect(component.userDict).toBe(undefined);
        expect(component.noFriendsStatus).toBe(undefined);
        expect(component.user).toBe(undefined);
        expect(component.friendUserId).toBe(undefined);

        expect(component.errMsg).toBe(undefined);
        expect(component.life).toBe(undefined);
        expect(component.gameErrorMsg).toBe('Sorry, don\'t have enough life.');
        expect(component.loaderStatus).toBe(false);

        expect(component.filteredCategories).toBe(undefined);
        expect(component.selectedCategories).toEqual([]);
        expect(component.routeType).toBe('');

        expect(component.topTags).toBe(undefined);

    });

    it('verify set categories list after value is emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: testData.categoryList
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categories).toEqual(testData.categoryList);
    });

    it('verify tags after value is emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            tags: testData.tagList
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.tags).toEqual(testData.tagList);
    });


    it('verify getTopTopics after value is emitted', () => {
        const topTagsList = cloneDeep(testData.getTopTags);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: topTagsList
        });

        topTagsList.map((tag: any) => {
            tag.requiredForGamePlay = false;
            tag.isSelected = false;
        });

        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.topTags).toEqual(topTagsList);
    });


    it('verify userDictionary after value is emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userDict: testData.userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.userDict).toEqual(testData.userDict);
    });

    it('verify user after value is emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: cloneDeep(testData.getTopTags),
            user: testData.userList[0]
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.user).toEqual(testData.userList[0]);
    });


    it('verify if tag is selected from user tag list', () => {
        const topTagsList = cloneDeep(testData.getTopTags);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: topTagsList,
            user: testData.userList[0]
        });
        mockStore.refreshState();
        fixture.detectChanges();
        topTagsList.map(data => {
            data.requiredForGamePlay = false;
            if (testData.userList[0].tags.indexOf(data.key) >= 0) {
                data.isSelected = true;
            } else {
                data.isSelected = false;
            }
        });
        expect(component.topTags).toEqual(topTagsList);
    });

    it('verify if tag is selected from user lastGamePlayOption list', () => {
        const topTagsList = cloneDeep(testData.getTopTags);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: topTagsList,
            user: testData.userList[7]
        });
        mockStore.refreshState();
        fixture.detectChanges();
        topTagsList.map(data => {
            data.requiredForGamePlay = false;
            if (testData.userList[7].lastGamePlayOption.tags.indexOf(data.key) >= 0) {
                data.isSelected = true;
            } else {
                data.isSelected = false;
            }
        });
        expect(component.topTags).toEqual(topTagsList);
    });

    it('verify if application settings is set after the value is emitted ', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSettings[0]);
    });


    it('verify if life is set after the account value is emitted ', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        const account = cloneDeep(testData.accounts[0]);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings,
            account: account
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.life).toEqual(account.lives);
    });

    it('verify filteredCategories is set after the account value is emitted ', () => {
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
        expect(component.filteredCategories).toEqual(testData.newGameFilteredCategories);
    });

    it('verify resetNewGame action should be dispatched', () => {
        // 
        expect(spy).toHaveBeenCalledWith(new GameActions().resetNewGame());
    });

    it('verify ResetCurrentGame action should be dispatched', () => {
        expect(spy).toHaveBeenCalledWith(new gameplayactions.ResetCurrentGame());
    });

    it('verify gameOptions is initialized', () => {
        expect(component.gameOptions).toEqual(new GameOptions());
    });


    it('verify isCategorySelected() function should work for categoryWith requiredForGamePlay as true', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[0])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, true)).toBe(true);
    });


    it('verify isCategorySelected() function should work for categoryWith requiredForGamePlay as false', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[0])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, false)).toBe(false);
    });


    it(`verify isCategorySelected() function should work for categoryWith requiredForGamePlay as false and part
        of user categorylist`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[8])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, false)).toBe(true);
    });

    it(`verify isCategorySelected() function should work for categoryWith requiredForGamePlay as false and not part
         of user categorylist`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[9])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, false)).toBe(false);
    });

    it(`verify isCategorySelected() function should work for categoryWith requiredForGamePlay as false and part
        of user last played games categorylist`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[7])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, false)).toBe(true);
    });

    it(`verify isCategorySelected() function should work for categoryWith requiredForGamePlay as false and not part
        of user last played games categorylist`, () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: cloneDeep(testData.userList[10])
        });
        mockStore.refreshState();
        expect(component.isCategorySelected(1, false)).toBe(false);
    });


    it('verify that selectTags() function works correctly', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        component.selectTags('java');
        const dataSelected = component.topTags.filter(data => data.key === 'java')[0].isSelected;
        expect(dataSelected).toBe(true);
    });

    it('verify that selectTags() function works correctly if tag is selected', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            getTopTags: cloneDeep(testData.getTopTags)
        });
        mockStore.refreshState();
        const index = component.topTags.findIndex(data => data.key === 'java');
        component.topTags[index].isSelected = true;
        component.selectTags('java');
        const dataSelected = component.topTags.filter(data => data.key === 'java')[0].isSelected;
        expect(dataSelected).toBe(false);
    });

    it('verify that filter() function works correctly ', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            tags: cloneDeep(testData.tagList)
        });
        mockStore.refreshState();
        expect(component.filter('av')).toEqual(['Java', 'JavaScript']);
    });


    it('verify that validateGameOptions() function works correctly without friendId set ', () => {
        let newGameOptions = new GameOptions();
        newGameOptions = {
            'isChallenge': false,
            'playerMode': 1,
            'gameMode': 0,
            'categoryIds': [
                1,
                8,
                2
            ],
            'tags': [
                'test',
                'angular',
                'net',
                'cloud'
            ],
            'maxQuestions': 8,
            'opponentType': 1
        };
        expect(component.validateGameOptions(false, newGameOptions)).toEqual(false);
    });

    it('verify that validateGameOptions() function works correctly with friendId set ', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        let newGameOptions = new GameOptions();
        newGameOptions = {
            'isChallenge': false,
            'playerMode': 1,
            'gameMode': 0,
            'categoryIds': [
                1,
                8,
                2
            ],
            'tags': [
                'test',
                'angular',
                'net',
                'cloud'
            ],
            'maxQuestions': 8,
            'opponentType': 1
        };
        component.friendUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        expect(component.validateGameOptions(false, newGameOptions)).toEqual(undefined);
    });

    it(`verify that validateGameOptions() function works correctly with friendId set then if lives are 0 then
        redirectToDashboard() function should be called `, () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        let newGameOptions = new GameOptions();
        newGameOptions = {
            'isChallenge': false,
            'playerMode': 1,
            'gameMode': 0,
            'categoryIds': [
                1,
                8,
                2
            ],
            'tags': [
                'test',
                'angular',
                'net',
                'cloud'
            ],
            'maxQuestions': 8,
            'opponentType': 1
        };
        component.friendUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        const spyOnRedirectToDashboard = spyOn(component, 'redirectToDashboard');
        component.life = 0;
        component.validateGameOptions(false, newGameOptions);
        expect(spyOnRedirectToDashboard).toHaveBeenCalledTimes(1);
    });


    ;

    it('verify that getImageUrl() function works correctly', () => {

        const services = TestBed.get(Utils);
        const spyGetImageUrl = spyOn(services, 'getImageUrl');

        component.getImageUrl(testData.userList[0]);
        expect(component.utils.getImageUrl).toHaveBeenCalledTimes(1);
        expect(component.utils.getImageUrl).toHaveBeenCalledWith(testData.userList[0], 70, 60, '70X60');
    });

    it('verify that removeEnteredTag() function works correctly', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            tags: testData.tagList,
            getTopTags: cloneDeep(testData.getTopTags),
            user: testData.userList[0]
        });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.selectedTags).toContain('angular');
        component.removeEnteredTag('angular');
        expect(component.selectedTags).not.toContain('angular');
    });

});
