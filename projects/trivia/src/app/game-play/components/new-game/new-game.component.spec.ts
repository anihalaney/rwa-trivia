import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGameComponent } from './new-game.component';
import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils, WindowRef } from 'shared-library/core/services';
import { User, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { GameActions, UserActions, TagActions } from 'shared-library/core/store/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { GameOptions, userCardType } from 'shared-library/shared/model';
import * as gameplayactions from '../../store/actions';


describe('NewGameComponent', () => {

    let component: NewGameComponent;
    let fixture: ComponentFixture<NewGameComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewGameComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                GameActions,
                UserActions,
                TagActions,
                {
                    provide: Router,
                    useValue: {
                        url: '',
                        navigate() {}
                    }
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({userid: ''})
                    }
                },
                {
                    provide: WindowRef,
                    useValue: {
                        nativeWindow: {
                            scrollTo: function(start, end) {

                            }
                        }
                    }
                },
                {
                    provide: PLATFORM_ID,
                    useValue: 'browser'
                },
                {provide: Utils, useValue: {
                    regExpEscape(s: string) {
                        return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
                          replace(/\x08/g, '\\x08');
                    },
                    showMessage(type: string, msg: string) {
                    },
                    getImageUrl(user: User, width: Number, height: Number, size: string) {
                        return '';
                    }
                }},
                provideMockStore( {
                    selectors: [
                      {
                        selector: appState.coreState,
                        value: {}
                      }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule, ReactiveFormsModule, FormsModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(NewGameComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        fixture = TestBed.createComponent(NewGameComponent);
        component = fixture.debugElement.componentInstance;
        component.userCardType = userCardType;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

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
        expect(spy).toHaveBeenCalledWith( new GameActions().resetNewGame());
    });

    it('verify ResetCurrentGame action should be dispatched', () => {
        expect(spy).toHaveBeenCalledWith( new gameplayactions.ResetCurrentGame());
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
        newGameOptions =  {
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
        component.windowRef.nativeWindow.scrollTo = jest.fn();
        expect(component.validateGameOptions(false, newGameOptions)).toEqual(false);
        expect(component.windowRef.nativeWindow.scrollTo).toHaveBeenCalledTimes(1);
    });

    it('verify that validateGameOptions() function works correctly with friendId set ', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings
          });
          mockStore.refreshState();
        let newGameOptions = new GameOptions();
        newGameOptions =  {
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
        component.windowRef.nativeWindow.scrollTo = jest.fn();
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
        newGameOptions =  {
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
        component.redirectToDashboard = jest.fn();
        component.life = 0;
        component.validateGameOptions(false, newGameOptions);
        expect(component.redirectToDashboard).toHaveBeenCalledTimes(1);
    });

    it('verify that redirectToDashboard() function works correctly ', () => {
        component.router.navigate = jest.fn();
        component.redirectToDashboard('test message');
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
        expect(component.router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('verify that redirectToDashboard() function works correctly showMessage function should be called', () => {
        component.utils.showMessage = jest.fn();
        component.redirectToDashboard('test message');
        expect(component.utils.showMessage).toHaveBeenCalledTimes(1);
        expect(component.utils.showMessage).toHaveBeenCalledWith('success', 'test message');
    });

    it('verify that getImageUrl() function works correctly', () => {
        component.utils.getImageUrl = jest.fn();
        component.getImageUrl(testData.userList[0]);
        expect(component.utils.getImageUrl).toHaveBeenCalledTimes(1);
        expect(component.utils.getImageUrl).toHaveBeenCalledWith(testData.userList[0],  70, 60, '70X60');
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

    it('verify that destroy() function works correctly', () => {
        component.destroy();
        expect(component.userDict).toEqual({});
        expect(component.categories).toEqual([]);
        expect(component.tags).toEqual([]);
        expect(component.selectedTags).toEqual([]);
        expect(component.uFriends).toEqual([]);
        expect(component.tagsObs).toEqual(undefined);
        expect(component.applicationSettings).toEqual(undefined);
        expect(component.gameOptions).toEqual(undefined);
        expect(component.noFriendsStatus).toEqual(undefined);
        expect(component.user).toEqual(undefined);
        expect(component.friendUserId).toEqual(undefined);
        expect(component.errMsg).toEqual(undefined);
        expect(component.life).toEqual(undefined);
    });



    it('verify that getGameOptionsFromFormValue() function works correctly', () => {
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
        const newGameOptions =  {
            'isChallenge': false,
            'playerMode': 1,
            'gameMode': 0,
            'categoryIds': [
              1,
              8,
              2,
              3,
              4,
              5,
              7,
              9
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
        expect(component.getGameOptionsFromFormValue({
            playerMode: 1,
            opponentType: 1,
            isChallenge: false
        })).toEqual(newGameOptions);

    });

    it(' verify createform() function works correctly ', () => {
        fixture.detectChanges();
        expect(component.newGameForm.controls.friendUserId).not.toBeUndefined();
        expect(component.newGameForm.controls.gameMode).not.toBeUndefined();
        expect(component.newGameForm.controls.isChallenge).not.toBeUndefined();
        expect(component.newGameForm.controls.opponentType).not.toBeUndefined();
        expect(component.newGameForm.controls.playerMode).not.toBeUndefined();
        expect(component.newGameForm.controls.tagControl).not.toBeUndefined();
        expect(component.newGameForm.controls.tagsArray).not.toBeUndefined();

    });

    it(' verify createform() function works correctly with tags', () => {
        const newGameOptions =  {
            'isChallenge': false,
            'playerMode': 1,
            'gameMode': 0,
            'categoryIds': [
              1,
              8,
              2,
              3,
              4,
              5,
              7,
              9
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
          expect(component.createForm(newGameOptions)).toBeTruthy();

    });

    it(' verify selectFriendId() function works correctly', () => {
        fixture.detectChanges();
        component.selectFriendId('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.friendUserId).toEqual('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.errMsg).toBeUndefined();
        expect(component.newGameForm.controls.friendUserId.value).toEqual('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');

    });

    it(' verify selectCategory() function works correctly for select', () => {
        fixture.detectChanges();
        component.selectCategory({checked : true}, 1);
        expect(component.selectedCategories).toContain(1);
    });

    it(' verify selectCategory() function works correctly for deselect', () => {
        component.selectedCategories = [3, 5, 7];
        fixture.detectChanges();
        component.selectCategory({}, 3);
        expect(component.selectedCategories).not.toContain(3);
    });

    it(' verify onSubmit() function works correctly', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        const account = cloneDeep(testData.accounts[0]);
        component.startNewGame = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings,
            account: account
          });
        mockStore.refreshState();
        fixture.detectChanges();
        component.onSubmit();
        expect(component.loaderStatus).toBe(true);
        expect(component.startNewGame).toHaveBeenCalledTimes(1);
    });

    it(' verify onSubmit() function works correctly when form is invalid', () => {
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        const account = cloneDeep(testData.accounts[0]);
        component.startNewGame = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            applicationSettings: applicationSettings,
            account: account
          });
        mockStore.refreshState();
        fixture.detectChanges();
        component.newGameForm.get('playerMode').setValue('');
        component.onSubmit();
        expect(component.loaderStatus).toBe(false);
    });

    it(' verify addTag() function works correctly', () => {
        component.addTagToSelectedList = jest.fn();
        fixture.detectChanges();
        component.newGameForm.get('tagControl').setValue('Java');
        component.addTag();
        expect(component.addTagToSelectedList).toHaveBeenCalledTimes(1);
        expect(component.addTagToSelectedList).toHaveBeenCalledWith('Java');
    });

    it(' verify toggleShowUncheckedCategories() function works correctly', () => {
        component.toggleShowUncheckedCategories();
        expect(component.showUncheckedCategories).toEqual(true);
    });

    it(' verify addTagToSelectedList() function works correctly', () => {

        fixture.detectChanges();
        component.addTagToSelectedList('Java');
        expect(component.selectedTags).toContain('Java');
    });


    it(' verify addTagToSelectedList() function works correctly for existed tag', () => {
        component.selectedTags = ['Java'];
        fixture.detectChanges();
        component.addTagToSelectedList('Java');
        expect(component.selectedTags).toContain('Java');
    });

    it(' verify challengerUserId is not null then opponentType is set to 1', () => {
        component.route.params = of({userid: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1'});
        fixture.detectChanges();
        expect(component.newGameForm.get('opponentType').value).toEqual('1');
    });

    it(' verify mode is set and mode value is \'Two\' then playerMode should be 1 and opponentType is 0', () => {
        component.route.params = of({mode: 'Two'});
        fixture.detectChanges();
        expect(component.newGameForm.get('opponentType').value).toEqual('0');
        expect(component.newGameForm.get('playerMode').value).toEqual('1');
    });

    it(' verify mode is set and mode value is \'Single\' then playerMode should be 0', () => {
        component.route.params = of({mode: 'Single'});
        fixture.detectChanges();
        expect(component.newGameForm.get('playerMode').value).toEqual('0');
    });

    it(' verify playerModeControl is 1 then enable opponentTypeControl', () => {
        component.route.params = of({mode: 'Single'});
        fixture.detectChanges();
        component.newGameForm.get('playerMode').setValue('1');
        expect(component.newGameForm.get('opponentType').enabled).toEqual(true);
        expect(component.newGameForm.get('opponentType').value).toEqual('0');
    });

    it(' verify playerModeControl is not 1 then enable opponentTypeControl', () => {
        component.route.params = of({mode: 'Single'});
        fixture.detectChanges();
        component.newGameForm.get('opponentType').reset = jest.fn();
        component.newGameForm.get('playerMode').setValue('0');
        expect(component.newGameForm.get('opponentType').enabled).toEqual(false);
        expect(component.newGameForm.get('opponentType').reset).toHaveBeenCalledTimes(1);
    });

    it('verify startNewGame function works', () => {

        let newGameOptions = new GameOptions();
        newGameOptions =  {
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
          mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
            });
        mockStore.refreshState();
        component.startNewGame(newGameOptions);
        expect(spy).toHaveBeenLastCalledWith(
            new gameplayactions.CreateNewGame({ gameOptions: newGameOptions, user: testData.userList[0] })
            );
    });


    afterEach(() => {
        fixture.destroy();
    });

});
