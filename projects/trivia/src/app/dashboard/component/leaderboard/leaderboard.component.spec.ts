import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { LeaderboardComponent } from './leaderboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus, Topic } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { UserActions, TagActions, TopicActions } from "shared-library/core/store/actions";
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DashboardState } from '../../store';

describe('LeaderboardComponent', () => {

    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    let spy: any;
    let user: User;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeaderboardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                UserActions,
                {provide: ActivatedRoute, useValue: {
                      params: of(
                        {
                            category: 'id_query_params_test'
                        }
                      )
                }},
                TagActions,
                TopicActions,
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
                        value: {
                            userDict: {},
                            topTopics: [],
                            categories: []
                        }
                      },
                      {
                          selector: appState.dashboardState,
                          value: {}
                      }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(LeaderboardComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('User dictionary should be empty initially', () => {
          mockStore.refreshState();
          expect(component.userDict).toEqual({});
    });

    it('logged In User should be empty intially', () => {
            expect(component.loggedInUserId).toBeFalsy();
    });

    it('User should be empty intially', () => {
        expect(component.user).toBeUndefined();
    });

    it('Leader board data be empty intially', () => {
        expect(component.leaderBoardCat).toEqual([]);
    });

    it('Leader board list start index intially should be falsy', () => {
        expect(component.lbsSliceStartIndex).toEqual(-1);
    });

    it('Maximum number of leaderboard entries should be 10', () => {
        expect(component.maxLeaderBoardDisplay).toEqual(10);
   });

    it('trackByFn should return  index', () => {
        const index = component.trackByFn(5, {});
        expect(index).toEqual(5);
    });

    it('User dictionary should be set when values are emitted', () => {
        user = { ...TEST_DATA.userList[0] };
        const userDict = {};
        TEST_DATA.userList.map(data => {
            userDict[data.userId] = data;
        });
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userDict: userDict,
            topTopics: [],
            categories: []
        });
        mockStore.refreshState();
        expect(component.userDict).toBe(userDict);
    });

    it('Category dictionary list and topic list should be set when values are emitted', () => {
        const topTopics = [];
        TEST_DATA.topTopics.forEach(data => {
            topTopics.push({id: data.id, categoryName: data.key, type: data.key});
        });
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            topTopics: topTopics,
            categories: [],
            user: null
          });

        const categoryDictList = [...topTopics];
        const topicDict = [];
        categoryDictList.map((data: Topic) => {
            topicDict[data.id] = data;
        });

        mockStore.refreshState();
        expect(component.topicDict).toStrictEqual(topicDict);
        expect(component.categoryDictList).toStrictEqual(categoryDictList);
    });

    it('Logged In user should be set when values are emitted', () => {

        const user = TEST_DATA.userList[0];
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            topTopics: [],
            categories: [],
            user: user
            });

            mockStore.refreshState();
            expect(component.loggedInUserId).toBe(user.userId);
    });

    it('displayMore function should be set the value correctly', () => {

        component.lbsUsersSliceLastIndex = 15;
        component.displayMore();
        expect(component.lbsUsersSliceLastIndex).toBe(22);
    });

    it('Category dictionary should be set when values are emitted', () => {
        const categories = TEST_DATA.categoryList;

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            topTopics: [],
            categories: categories,
            user: null
            });

            mockStore.refreshState();
            expect(component.categoryDict).toEqual(TEST_DATA.categoryDictionary);
    });

    it('score board should be initially empty', () => {
            const user = TEST_DATA.userList[0];
            mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
                    topTopics: [],
                    categories: [],
                    user: user
            });

            mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
                scoreBoard: []
            });

            mockStore.refreshState();
            expect(component.leaderBoardStatDictArray).toEqual([]);
    });

    it('score board should be set when values are emitted', () => {
        const user = TEST_DATA.userList[0];
        const categories = TEST_DATA.categoryList;
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
                topTopics: [],
                categories: categories,
                user: user
        });

        mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
            scoreBoard: TEST_DATA.leaderBoard
        });

        mockStore.refreshState();
        expect(component.leaderBoardStatDictArray).toEqual(TEST_DATA.leaderBoard);
    });

    it('leaderboard category should be set when leaderboard contains more than one user values are emitted', () => {
        const user = TEST_DATA.userList[0];
        const categories = TEST_DATA.categoryList;

        const topTopics = [];
        TEST_DATA.topTopics.forEach(data => {
            topTopics.push({id: data.id, categoryName: data.key, type: data.key});
        });

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
                user: user,
                topTopics: topTopics,
                categories: categories
        });

        mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
            scoreBoard: TEST_DATA.leaderBoard
        });

        mockStore.refreshState();

        const leaderBoardCat = [];
        const items = [];
        TEST_DATA.leaderBoard.map(
            (leaderBoard: any) => {
              if (leaderBoard.users.length > 0) {
                leaderBoardCat.push(leaderBoard['type'] === 'category' ?  TEST_DATA.categoryDictionary[leaderBoard.id].categoryName :
                (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
              }
              items.push(leaderBoard['type'] === 'category' ?  TEST_DATA.categoryDictionary[leaderBoard.id].categoryName :
              (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
            }
        );


        expect(component.leaderBoardCat).toEqual(leaderBoardCat);
    });

    it('leaderboard data should be set when leaderboard contains more than one user values are emitted', () => {
        const user = TEST_DATA.userList[0];
        const categories = TEST_DATA.categoryList;

        const topTopics = [];
        TEST_DATA.topTopics.forEach(data => {
            topTopics.push({id: data.id, categoryName: data.key, type: data.key});
        });

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
                user: user,
                topTopics: topTopics,
                categories: categories
        });

        mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
            scoreBoard: TEST_DATA.leaderBoard
        });

        mockStore.refreshState();

        const leaderBoardCat = [];
        const items = [];
        const leaderBoardStatDictArr = {};
        TEST_DATA.leaderBoard.map(
            (leaderBoard: any) => {
              if (leaderBoard.users.length > 0) {
                leaderBoardCat.push(leaderBoard['type'] === 'category' ?  TEST_DATA.categoryDictionary[leaderBoard.id].categoryName :
                (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
              }
              items.push(leaderBoard['type'] === 'category' ?  TEST_DATA.categoryDictionary[leaderBoard.id].categoryName :
              (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
            }
        );
        TEST_DATA.leaderBoard.filter((leaderBoardStatDict: any) => {
            leaderBoardStatDictArr[leaderBoardStatDict['type'] === 'category' ?
            TEST_DATA.categoryDictionary[leaderBoardStatDict.id].categoryName :
            `${leaderBoardStatDict.id.charAt(0).toUpperCase()}${leaderBoardStatDict.id.slice(1)}`] =
            leaderBoardStatDict.users;
        });
        expect(component.items).toEqual(items);
        expect(component.leaderBoardCat).toEqual(leaderBoardCat);
        expect(component.leaderBoardStatDict).toEqual(leaderBoardStatDictArr);
        expect(component.lbsUsersSliceStartIndex).toEqual(0);
        expect(component.lbsUsersSliceStartIndex).toEqual(0);
        expect(component.selectedCatList).toEqual(leaderBoardStatDictArr[items[0]]);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
