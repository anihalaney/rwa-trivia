import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentGameCardComponent } from './recent-game-card.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, categoryDictionary } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { testData } from 'test/data';
import { Game } from 'shared-library/shared/model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecentGameCardComponent', () => {
  let component: RecentGameCardComponent;
  let fixture: ComponentFixture<RecentGameCardComponent>;
  let mockStore: MockStore<CoreState>;
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

    component.user = testData.userList[0];
    const dbModel = testData.games[0];
    component.game = Game.getViewModel(dbModel);

    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Category dictionary should be set when store emit Category dictionary', () => {
    const categoryDict = testData.categoryDictionary;
    mockCategorySelector.setResult(categoryDict);
    mockStore.refreshState();
    expect(component.categoryDict).toBe(categoryDict);
  });

  it('on component load should call getOppnonentID function', () => {
    spy = spyOn(component, 'getOpponentId');
    component.ngOnInit();
    expect(component.getOpponentId).toHaveBeenCalled();
  });

  it('call to getOpponentId function should return correct opponent Id for passed game', () => {
    const dbModel = testData.games[0];
    const opponentId = dbModel.playerIds[1];
    const game = Game.getViewModel(dbModel);
    expect(component.getOpponentId(game)).toBe(opponentId);
  });

  it('User dictionary should be set when store emit user dictionary', () => {
    const userDict = testData.userDict;
    mockCoreSelector.setResult({ userDict: userDict });
    mockStore.refreshState();
    expect(component.userDict).toBe(userDict);
  });


});