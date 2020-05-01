import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
// import { fakeSchedulers } from 'rxjs-marbles/jasmine/angular';
import { GameCardComponent } from './game-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { select, Store, StoreModule, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserActions } from 'shared-library/core/store/actions/user.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import {
    User, Game, Category, PlayerMode, GameStatus, CalenderConstants, userCardType,
    ApplicationSettings
} from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { TEST_DATA } from 'shared-library/testing/test.data';

// import { cold } from 'jasmine-marbles';
import { CoreState } from 'shared-library/core/store';
import { delay } from 'rxjs/operators';

import { MatSnackBarModule } from '@angular/material';

import { Subscription } from 'rxjs';
class RouterStub {
    navigateByUrl(url: string) { return url; }
}

class UserActionStub {

}

describe('GameCardComponent', () => {

    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let _store: any;
    let spy: any;
    let user: User;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;




    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
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
                          user: null,
                          userDict: null
                        }
                      }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameCardComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

        // init data
        _store = fixture.debugElement.injector.get(Store);
        const dbModel = TEST_DATA.game[0];
        component.game = Game.getViewModel(dbModel);

        // spyOn(component, 'updateRemainingTime');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should match snapshot', () => {
        component.isHidePlayNow = false;
        component.applicationSettings = TEST_DATA.applicationSettings;

        component.categoryDict = TEST_DATA.categoryDictionary;
        component.user = TEST_DATA.userList[0];
        component.PlayerMode = PlayerMode;
        component.gameStatus = GameStatus;
        const otherUser = { ...TEST_DATA.userList[1] };
        component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        component.userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
        component.ngOnInit();
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('verify capitalizeFirstLetter function', () => {
        const categoryName = 'infrastructure/networking';
        const categoryNameWithCapitalizedFirstLetter = component.capitalizeFirstLetter(categoryName);
        expect(categoryNameWithCapitalizedFirstLetter).toEqual('Infrastructure/networking');
    });

    it(`Initially user value should be undefined `, () => {
        expect(component.user).toBe(undefined);
    });

    it('subscription for logged in user', () => {
        user = { ...TEST_DATA.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
          });
          mockStore.refreshState();
          expect(component.user).toBe(user);
      });

      it('subscription for user dictionary', () => {
        user = { ...TEST_DATA.userList[0] };
        const otherUser = { ...TEST_DATA.userList[1] };
        const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userDict: userDict
          });
          mockStore.refreshState();
          expect(component.userDict).toBe(userDict);
      });


    it('remaining time should be 2 hr 30 min', (async () => {

        component.isHidePlayNow = false;
        component.applicationSettings = TEST_DATA.applicationSettings;

        component.categoryDict = TEST_DATA.categoryDictionary;
        component.user = TEST_DATA.userList[0];
        component.PlayerMode = PlayerMode;
        component.gameStatus = GameStatus;
        const otherUser = { ...TEST_DATA.userList[1] };
        component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        component.userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
        component.updateRemainingTime();

        await new Promise((r) => setTimeout(r, 2000));
        expect(component.remainingMinutes).toBe('30');
        expect(component.remainingHours).toBe('02');
    }));

    it('remaining time should be 0 hr 0 min', (async () => {

        component.isHidePlayNow = false;
        component.applicationSettings = TEST_DATA.applicationSettings;
        const dbModel = TEST_DATA.game[1];
        component.game = Game.getViewModel(dbModel);
        component.categoryDict = TEST_DATA.categoryDictionary;
        component.user = TEST_DATA.userList[0];
        component.PlayerMode = PlayerMode;
        component.gameStatus = GameStatus;
        const otherUser = { ...TEST_DATA.userList[1] };
        component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
        component.userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
        component.updateRemainingTime();

        await new Promise((r) => setTimeout(r, 2000));
        expect(component.remainingMinutes).toBe('00');
        expect(component.remainingHours).toBe('00');
    }));

    //   it('Verify updateRemainingTime function', async(() => {
    //     user = { ...TEST_DATA.userList[0] };
    //     const otherUser = { ...TEST_DATA.userList[1] };
    //     const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
    //     mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
    //         user: user,
    //         userDict: userDict
    //       });
    //       mockStore.refreshState();

    //       jest.useFakeTimers();
    //       expect(component.remainingHours).toEqual(undefined);
    //       component.updateRemainingTime();
    //       jest.advanceTimersByTime(1);
    //       expect(component.remainingHours).toEqual('32');
    //       jest.useRealTimers();

    //   }));

    //   it('verfiy timer function ', fakeSchedulers(() => {

    //     const newSub: Subscription = component.timerSub;
    //     user = { ...TEST_DATA.userList[0] };
    //     const otherUser = { ...TEST_DATA.userList[1] };
    //     const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
    //     component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
    //     component.userDict = userDict;
    //     component.user = user;
    //     fixture.detectChanges();
    //     tick(3000);
    //     expect(component.updateGameRemainTime).toHaveBeenCalledTimes(1); // fail
    //     newSub.unsubscribe();
    //   }));



    //   it('verfiy timer function ', fakeSchedulers(() => {

    //     const newSub: Subscription = component.timerSub;
    //     user = { ...TEST_DATA.userList[0] };
    //     const otherUser = { ...TEST_DATA.userList[1] };
    //     const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user, 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': otherUser};
    //     component.otherUserId = 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1';
    //     component.userDict = userDict;
    //     component.user = user;
    //     fixture.detectChanges();
    //     tick(3000);
    //     expect(component.updateGameRemainTime).toHaveBeenCalledTimes(1); // fail
    //     newSub.unsubscribe();
    //   }));
    //   afterEach(() => { fixture.destroy(); });

    
});
