import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentGamesComponent } from './recent-games.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActionWithPayload, coreState, CoreState, UserActions } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { User, Game } from 'shared-library/shared/model';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('RecentGamesComponent', () => {
  let component: RecentGamesComponent;
  let fixture: ComponentFixture<RecentGamesComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RecentGamesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          }
        ]
      }),
        UserActions,
        Utils,
        WindowRef, ],

    });

    fixture = TestBed.createComponent(RecentGamesComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on component load initial value should set', () => {
    expect(component.startIndex).toBe(0);
    expect(component.nextIndex).toBe(4);
    expect(component.maxIndex).toBe(10);
  });

  it('on component load should set user when user is logged in', () => {

    const user: User = TEST_DATA.userList[1];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(component.user).toBe(user);
  });

  it('on component load should dispatch action to get game result with correct payload when user is logged in', () => {

    const user: User = TEST_DATA.userList[1];
    spy.and.callFake((action: ActionWithPayload<User>) => {
      expect(action.type).toEqual(UserActions.GET_GAME_RESULT);
      expect(action.payload).toEqual(user);
    });
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('set recentGames on subscribe getGameResult', () => {
    const games = TEST_DATA.game.map(dbModel => {
      return Game.getViewModel(dbModel);
    });
    mockCoreSelector.setResult({ getGameResult: games });
    mockStore.refreshState();
    expect(component.recentGames).toBe(games);
  });


  it('on call getMoreCard function nextIndex should be 14', () => {
    component.recentGames = TEST_DATA.game.map(dbModel => {
      return Game.getViewModel(dbModel);
    });
    component.getMoreCard();
    expect(component.nextIndex).toBe(14);

  });

  it('on call second time getMoreCard function next Index should be 16', () => {
    component.recentGames = TEST_DATA.game.map(dbModel => {
      return Game.getViewModel(dbModel);
    });

    // Set nextIndex 14 because we call getMoreCard second time.
    component.nextIndex = 14;
    component.getMoreCard();
    expect(component.nextIndex).toBe(16);
  });


  it('on call second time getMoreCard function next Index should be 12', () => {
    // next Index should be  12 because we have less recentGames then  (nextIndex+maxIndex)

    // slice recentGames 12
    component.recentGames = TEST_DATA.game.map(dbModel => {
      return Game.getViewModel(dbModel);
    }).slice(0, 12);
    component.getMoreCard();
    expect(component.nextIndex).toBe(12);
  });


});
