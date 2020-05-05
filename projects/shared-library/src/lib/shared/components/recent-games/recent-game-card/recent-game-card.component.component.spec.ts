import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentGameCardComponent } from './recent-game-card.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { AppState } from '../../../../../../../trivia/src/app/store';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { UserCardComponent } from 'shared-library/shared/components';

describe('RecentGameCardComponent', () => {
  let component: RecentGameCardComponent;
  let fixture: ComponentFixture<RecentGameCardComponent>;
  let mockStore: MockStore<AppState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;


  beforeEach(async(() => {

    TestBed.configureTestingModule({

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
        WindowRef,],
      declarations: [RecentGameCardComponent, UserCardComponent]
    });

    fixture = TestBed.createComponent(RecentGameCardComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;

    component.user = TEST_DATA.userList[0];

    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentGameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});