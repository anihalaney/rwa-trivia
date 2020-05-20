import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
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
import { Category, GameOptions, ApplicationSettings, PlayerMode, OpponentType, userCardType } from 'shared-library/shared/model';


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
                        setUrl: function (url: string) { this.url = url; }
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
                    useValue: {}
                },
                {
                    provide: PLATFORM_ID,
                    useValue: 'Browser'
                },
                {provide: Utils, useValue: {
                    getTimeDifference(turnAt: number) {
                        return 1588313130838 - turnAt;
                    },
                    convertIntoDoubleDigit(digit: Number) {
                        return (digit < 10) ? `0${digit}` : `${digit}`;
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
        expect(component.noFriendsStatus).toBe(true);
        expect(component.user).toBe(undefined);
        expect(component.friendUserId).toBe(undefined);

        expect(component.errMsg).toBe(undefined);
        expect(component.life).toBe(undefined);
        expect(component.gameErrorMsg).toBe('Sorry, don\'t have enough life.');
        expect(component.loaderStatus).toBe(false);

        expect(component.filteredCategories).toBe(undefined);
        expect(component.selectedCategories).toBe(undefined);
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
            user: testData.userList[3]
          });
          mockStore.refreshState();
          fixture.detectChanges();
          topTagsList.map(data => {
            data.requiredForGamePlay = false;
            if (testData.userList[3].lastGamePlayOption.tags.indexOf(data.key) >= 0) {
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
        const appSettings = applicationSettings[0];

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            categories: cloneDeep(testData.categoryList),
            applicationSettings: applicationSettings,
            account: cloneDeep(testData.accounts[0]),
            user: cloneDeep(testData.userList[0])
          });
          mockStore.refreshState();
          fixture.detectChanges();
          expect(component.filteredCategories).toEqual(testData.newGameFilteredCategories);
    });


    it('verify userFriends is set after the value is emitted ', () => {
      //  this is pending ---------------------------------------------------
      mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
          userFriends: cloneDeep(testData.userFriends),
          user: cloneDeep(testData.userList[0])
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.uFriends).toEqual(testData.userFriends);
  });



    afterEach(() => {
        fixture.destroy();
    });

});
