import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  nsTestBedAfterEach,
  nsTestBedBeforeEach,
  nsTestBedRender,
} from 'nativescript-angular/testing';
import { ProfileSettingsComponent } from './../app/user/components/profile-settings/profile-settings.component.tns';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User } from 'shared-library/shared/model';
import {
  AppState, appState, categoryDictionary,
  getCategories,
  getTags
} from './../app/store';
import { userState, UserState } from './../app/user/store';
import { Router } from '@angular/router';
import { Utils } from 'shared-library/core/services';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoreState, UserActions, UIStateActions, coreState, getTopTopics } from 'shared-library/core/store';
import { SegmentedBarItem } from 'tns-core-modules/ui/segmented-bar/segmented-bar';
import { CheckDisplayNameComponent } from 'shared-library/shared/components';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;
  let user: User;
  let router: Router;
  let spy: any;
  const applicationSettings: any[] = [];
  const store: Store<CoreState> = null;

  const firebaseAuthService: FirebaseAuthService = null;
  let mockStore: MockStore<AppState>;
  let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;


  const setUserData = () => {
    component.user = { ...testData.userList[0] };
    user = { ...testData.userList[0] };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account, addressUsingLongLat: testData.addressUsingLongLat });
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    mockStore.refreshState();
  };

  const firebaseAuthState = () => {
    firebaseAuthService.authState().subscribe(afUser => {
      if (afUser) {
        firebaseAuthService.getIdToken(afUser, false).then((token) => {
          user = new User(afUser);
          user.idToken = token;
          store.dispatch(this.userActions.loginSuccess(this.user));

        });
      } else {
        // user not logged in
        store.dispatch(this.userActions.logoff());
      }
    });
  };

  afterEach(nsTestBedAfterEach());
  beforeEach(nsTestBedBeforeEach(
    [ProfileSettingsComponent, CheckDisplayNameComponent],
    [UserActions,
      provideMockStore({
        selectors: [
          {
            selector: appState.coreState,
            value: {}
          },
          {
            selector: userState,
            value: {}
          }
        ]
      }),
      {
        provide: Utils,
        useValue: {
          sendErrorToCrashlytics(type: any, error: any) {
          },
          showMessage(type: string, message: string) {
            return true;
          }
        }
      },
      UserActions,
      UIStateActions,
      {
        provide: AuthenticationProvider,
        useValue: firebaseAuthState
      },
      FirebaseAuthService,
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ userid: '4kFa6HRvP5OhvYXsH9mEsRrXj4o2' })
        }
      },
    ],
    [StoreModule.forRoot({}), [ReactiveFormsModule, NativeScriptFormsModule, RouterTestingModule.withRoutes([]),
      NativeScriptRouterModule.forRoot([])]]
  ));


  beforeEach((async () => {
    fixture = await nsTestBedRender(ProfileSettingsComponent);
    mockStore = TestBed.get(Store);
    component = fixture.componentInstance;
    spy = spyOn(mockStore, 'dispatch');
    mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
    router = TestBed.get(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verify if tab titles is set or not', () => {
    expect(component.tabsTitles).toEqual(['Profile', 'Stats']);
  });

  it('Verify if userProfileSaveStatus SUCCESS', () => {
    const services = TestBed.get(Utils);
    const spyMessage = spyOn(services, 'showMessage');
    const spyToggleLoader = spyOn(component, 'toggleLoader');
    mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
      userProfileSaveStatus: 'SUCCESS'
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(spyMessage).toHaveBeenCalled();
    expect(spyToggleLoader).toHaveBeenCalledWith(false);
    expect(component.isSavingUserName).toBeFalsy();
  });

  it('Verify if userProfileSaveStatus is not equal to SUCCESS && NONE && IN PROCESS && MAKE FRIEND SUCCESS', () => {
    const services = TestBed.get(Utils);
    const spyMessage = spyOn(services, 'showMessage');
    mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
      userProfileSaveStatus: 'ERROR'
    });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('Verify that user information should be set successfully', () => {
    user = { ...testData.userList[0] };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.user).toEqual(user);
  });

  it('Verify if address is set to location field and set captured should set mobile and isAutoComplete should be false', () => {

    user = { ...testData.userList[0] };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account, addressUsingLongLat: testData.addressUsingLongLat });
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);

    mockStore.refreshState();
    expect(component.acLocation.nativeElement.text).toBe('Ahmedabad,Gujarat');
    expect(component.user.captured).toBe('mobile');
    expect(component.user.isAutoComplete).toBe(false);

  });

  it('Verify set location text to acLocation', () => {

    const event = {
      object: {
        text: 'Ahmedabad,Gujarat',
        readOnly: true
      }
    };
    // component.user = { ...testData.userList[0] };
    // user = { ...testData.userList[0] };
    // applicationSettings.push(testData.applicationSettings);
    // mockCoreSelector.setResult({ user, applicationSettings, account: user.account, addressUsingLongLat: testData.addressUsingLongLat });
    // getCategories.setResult(testData.categoryList);
    // categoryDictionary.setResult(testData.categoryDictionary);
    // getTopTopics.setResult(testData.topTopics as any);
    // mockStore.refreshState();
    setUserData();
    component.onLoadedLocation(event);
    expect(component.acLocation.nativeElement.text).toBe('Ahmedabad,Gujarat');

  });

  it('Verify on call onTextChangedLocation it should set location to user form', () => {
    setUserData();
    const location = {
      text: 'Ahmedabad,Gujarat'
    };
    component.onTextChangedLocation(location);
    expect(component.user.captured).toBe('mobile');
    expect(component.userForm.get('location').value).toBe('Ahmedabad,Gujarat');
  });


  it('Verify on call editLocationField it should set opposite value', () => {
    component.singleFieldEdit['location'] = false;
    component.editLocationField();
    expect(component.singleFieldEdit['location']).toBeTruthy();
  });

  it('on onSelectedIndexChange call set selected index', () => {
    const action = {
      object: {
        selectedIndex: 2,
      }
    };
    component.onSelectedIndexChange(action);
    expect(component.selectedIndex).toBe(2);
  });

  it('on saveProfileImage call should call getUserFromFormValue, assignImageValues and saveUser', () => {
    setUserData();
    const spyAssignImageValues = spyOn(component, 'assignImageValues');
    const spyGetUserFromFormValue = spyOn(component, 'getUserFromFormValue');
    const spySaveUser = spyOn(component, 'saveUser');
    component.saveProfileImage();
    expect(spyGetUserFromFormValue).toHaveBeenCalledTimes(1);
    expect(spyAssignImageValues).toHaveBeenCalledTimes(1);
    expect(spySaveUser).toHaveBeenCalledTimes(1);
  });

  it('On call assignImageValues it should set image info', () => {
    setUserData();
    component.assignImageValues();
    fixture.detectChanges();
    expect(user.profilePicture).not.toBeNull();
    expect(component.user.originalImageUrl).toBe('/assets/images/default-avatar-small.png');
    expect(component.user.croppedImageUrl).toBe('/assets/images/default-avatar-small.png');
    expect(component.user.imageType).toBe('image/jpeg');
    expect(component.userForm.get('profilePicture').value).not.toBeNull();
  });

});
