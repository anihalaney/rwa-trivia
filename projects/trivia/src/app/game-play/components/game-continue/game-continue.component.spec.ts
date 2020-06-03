import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GameContinueComponent } from './game-continue.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Utils } from 'shared-library/core/services';
import { User, Game, PlayerMode, GameStatus } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { MatSnackBarModule, MatDialog } from '@angular/material';
import {MatDialogModule} from '@angular/material';

describe('GameContinueComponent', () => {

    let component: GameContinueComponent;
    let fixture: ComponentFixture<GameContinueComponent>;
    let spy: any;
    let user: User;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameContinueComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                MatDialog,
                UserActions,
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
            imports: [ MatSnackBarModule, MatDialogModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(GameContinueComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');

        component = fixture.debugElement.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('continueClicked() function should emit continueButtonClicked event', () => {
        spyOn(component.continueButtonClicked, 'emit');
        component.continueClicked();
        expect(component.continueButtonClicked.emit).toHaveBeenCalledTimes(1);
    });

    it('User should be set value is emitted', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
          });
          mockStore.refreshState();
          expect(component.user).toBe(user);
      });

    it('User dictionary should be set value is emitted', () => {
        const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1]};
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userDict: userDict
          });
          mockStore.refreshState();
          expect(component.userDict).toBe(userDict);
    });

    it('Other user info should be set in ngOnInit', () => {
        const dbModel = testData.games[1];
        const userDict = {'4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1]};
        component.game = Game.getViewModel(dbModel);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
          });
          mockStore.refreshState();
        fixture.detectChanges();
        expect(component.otherUserId).toBe('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.otherUserInfo).toEqual(testData.userList[1]);
    });

    it('Other user info should not be set in ngOnInit if game is empty', () => {
        fixture.detectChanges();
        expect(component.otherUserId).not.toBe('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.otherUserInfo).not.toEqual(testData.userList[1]);
    });


    afterEach(() => {
        fixture.destroy();
    });

});
