import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testData } from 'test/data';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { ActionWithPayload, coreState, CoreState, UserActions } from 'shared-library/core/store';
import { Utils, WindowRef } from 'shared-library/core/services';
import { User } from 'shared-library/shared/model';
import { MatSnackBarModule } from '@angular/material';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  let mockStore: MockStore<CoreState>;
  let spy: any;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  const userId = testData.userList[3].userId;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [StoreModule.forRoot({}), MatSnackBarModule],
      providers: [
        {
          provide: Utils, useValue: {
            getImageUrl(user: User, width: Number, height: Number, size: string) {
              return `assets/images/avatar-${size}.png`;
            },
            goToDashboard() {
              return '';
            }
          }
        },
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            }
          ]
        }),
        WindowRef,
        UserActions]
    });

    fixture = TestBed.createComponent(UserCardComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;

    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    spy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of the data should be falsy', () => {
    expect(component.userCardType).toBeTruthy();
    expect(component.userDict).toBeFalsy();
  });

  it(`user should be set when store emit User`, () => {
    component.user = testData.userList[3];
    mockCoreSelector.setResult({ user: testData.userList[3] });
    mockStore.refreshState();
    expect(component.loggedInUserId).toEqual(userId);
    expect(component.user).toEqual(testData.userList[3]);
  });


  it('User dictionary should be set when store emit user dictionary ' +
    +'it should call setUser and loadUserInfo function', () => {
      const spy1 = spyOn(component, 'setUser').and.callThrough();
      const spy2 = spyOn(component, 'loadUserInfo').and.callThrough();
      expect(spy1);
      expect(spy2);
      component.user = testData.userList[3];
      component.userId = userId;
      mockCoreSelector.setResult({ userDict: testData.userDict });
      mockStore.refreshState();
      component.ngOnInit();
      expect(component.userDict).toBe(testData.userDict);
      expect(component.setUser).toHaveBeenCalled();
      expect(component.loadUserInfo).toHaveBeenCalled();
    });

  it('call to setUser function should set the user if user id matches with user of User dictionary ', () => {
    component.userDict = testData.userDict;
    component.userId = userId;
    component.user = testData.userDict[userId];
    component.setUser();
    expect(component.user).toBe(testData.userDict[userId]);
  });

  it('call to goToDashboard function should navigate to the dashboard', () => {
    spy = spyOn(component.utils, 'goToDashboard').and.callThrough();
    expect(spy);
    component.goToDashboard();
    expect(component.utils.goToDashboard).toHaveBeenCalled();
  });

  it('call to getImageUrl should return image Url', () => {
    const url = component.getImageUrl(testData.userList[3], 100, 200);
    expect(url).toBe(`assets/images/avatar-100X200.png`);
  });

  it('When ngOnchanges function is called , it should call loadUserInfo function', () => {
    const spyLoadUserInfo = spyOn(component, 'loadUserInfo').and.callThrough();
    expect(spyLoadUserInfo);
    component.userDict = testData.userDict;
    component.userId = userId;
    component.user = testData.userDict[userId];
    component.ngOnChanges();
    expect(component.user).toEqual(testData.userDict[userId]);
    expect(component.loadUserInfo).toHaveBeenCalled();
  });

  it('call to loadUserInfo it should dispatch the load other user profile action', () => {
    component.user = testData.userList[3];
    component.userId = userId;
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.LOAD_OTHER_USER_PROFILE);
      expect(action.payload).toEqual(userId);
    });
    component.loadUserInfo();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});
