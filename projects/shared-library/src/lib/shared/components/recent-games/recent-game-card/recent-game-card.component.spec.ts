import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentGameCardComponent } from './recent-game-card.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, categoryDictionary } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { AppState } from '../../../../../../../trivia/src/app/store';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { Game } from 'shared-library/shared/model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecentGameCardComponent', () => {
  let component: RecentGameCardComponent;
  let fixture: ComponentFixture<RecentGameCardComponent>;
  let mockStore: MockStore<AppState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RecentGameCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule],
      providers: [provideMockStore({
        initialState: {},
        selectors: [
          {
            selector: coreState,
            value: {}
          },
          {
            selector: categoryDictionary,
            value: {}
          }
        ]
      }),
        UserActions,
        Utils,
        WindowRef,],

    });

    fixture = TestBed.createComponent(RecentGameCardComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;

    component.user = TEST_DATA.userList[0];
    const dbModel = TEST_DATA.game[0];
    component.game = Game.getViewModel(dbModel);

    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    mockCategorySelector = mockStore.overrideSelector<any, Partial<any>>(categoryDictionary, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On subscribe categoryDictionary, categoryDict should set', () => {
    const categoryDictionary = TEST_DATA.categoryDictionary;
    // console.log('s', categoryDictionary);
    // mockCategorySelector.setResult({ categoryDictionary });
    // mockStore.refreshState();
    // console.log("componenet>>", component.categoryDict)
    // console.log("categoryDictionary>>", categoryDictionary)
    // expect(component.categoryDict).toBe(categoryDictionary);
    expect(component).toBeTruthy();
  });

  it('On load component getOpponentId should call to get opponentId', () => {
    spy = spyOn(component, 'getOpponentId');
    component.ngOnInit();
    expect(component.getOpponentId).toHaveBeenCalled();
  });

  it('Check getOpponentId function should return opponent id', () => {
    const dbModel = TEST_DATA.game[0];
    const opponentId = dbModel.playerIds[1];
    const game = Game.getViewModel(dbModel);
    expect(component.getOpponentId(game)).toBe(opponentId);
  });

  it('on subscribe userDict, userDict should set ', () => {
    const userDict = TEST_DATA.userDict;
    mockCoreSelector.setResult({ userDict: userDict });
    mockStore.refreshState();
    expect(component.userDict).toBe(userDict);
  });


});