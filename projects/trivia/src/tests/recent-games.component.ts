import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  nsTestBedAfterEach,
  nsTestBedBeforeEach,
  nsTestBedRender,
} from 'nativescript-angular/testing';
import { RecentGamesComponent } from 'shared-library/shared/components/recent-games/recent-games.component.tns';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { User, Game } from 'shared-library/shared/model';
import { testData } from 'test/data';


describe('RecentGamesComponent', () => {
  let component: RecentGamesComponent;
  let fixture: ComponentFixture<RecentGamesComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  afterEach(nsTestBedAfterEach());
  beforeEach(nsTestBedBeforeEach(
    [RecentGamesComponent],
    [UserActions,
      provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          }
        ]
      })
    ],
    [ReactiveFormsModule, NativeScriptFormsModule, StoreModule.forRoot({})]
  ));
  beforeEach((async () => {
    fixture = await nsTestBedRender(RecentGamesComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On ngOnInit called hide action bar should set true if hideActionbar is undefined', () => {
    component.hideActionbar = undefined;
    component.ngOnInit();
    expect(component.hideActionbar).toBeFalsy();
  });

  it('On ngOnInit called hide action bar should set true if hideActionbar is false|true', () => {
    component.hideActionbar = false;
    component.ngOnInit();
    expect(component.hideActionbar).toBeTruthy();


  });

  it('On ngOnDestroy called  it should set renderView to false', () => {
    component.ngOnDestroy();
    expect(component.renderView).toBeFalsy();
  });


  /**
   *  Test case from parent class
   */
  it('on component load should component be initialized with correct values', () => {
    expect(component.startIndex).toBe(0);
    expect(component.nextIndex).toBe(4);
    expect(component.maxIndex).toBe(10);
  });

  it('on component load should set user when user is logged in', () => {

    const user: User = testData.userList[1];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(component.user).toBe(user);
  });

  it('on component load should dispatch action to get game result with correct payload when user is logged in', () => {

    const user: User = testData.userList[1];
    spy.and.callFake((action: ActionWithPayload<User>) => {
      expect(action.type).toEqual(UserActions.GET_GAME_RESULT);
      expect(action.payload).toEqual(user);
    });
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('Recent games should be set when store emits game results', () => {
    const games = testData.games.map(dbModel => {
      return Game.getViewModel(dbModel);
    });
    mockCoreSelector.setResult({ getGameResult: games });
    mockStore.refreshState();
    expect(component.recentGames).toBe(games);
  });


  it('When we have more recent games than current index plus max allowed, call to get more card should set next index to max allowed plus next index', () => {
    component.recentGames = testData.games.map(dbModel => {
      return Game.getViewModel(dbModel);
    });
    component.getMoreCard();
    expect(component.nextIndex).toBe(14);

  });


  // tslint:disable-next-line: max-line-length
  it('When we have less recent games than max index ,call to get more card should set next index to next index plus recent games length', () => {
    component.recentGames = testData.games.map(dbModel => {
      return Game.getViewModel(dbModel);
    }).slice(0, 5);
    component.getMoreCard();
    expect(component.nextIndex).toBe(9);
  });


  // tslint:disable-next-line: max-line-length
  it('When max allowed plus next index are greater than length of recent games , call to get more card should set next index to length of recent games', () => {
    // next Index should be  12 because we have less recentGames then  (nextIndex+maxIndex)

    // slice recentGames 12
    component.recentGames = testData.games.map(dbModel => {
      return Game.getViewModel(dbModel);
    }).slice(0, 12);
    component.getMoreCard();
    expect(component.nextIndex).toBe(12);
  });

});
