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
import * as utils from "tns-core-modules/utils/utils";
import * as geolocation from "nativescript-geolocation";

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
          },
          focusTextField() {
            return true;
          },
          hideKeyboard() {
            return true;
          },
          openUrl() {
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

  it('On call addCustomTag it should hide keyboard and and add tag into enteredTag', () => {
    component.customTag = 'C#';
    const spyHideKeyboard = spyOn(component, 'hideKeyboard');
    component.addCustomTag();
    expect(spyHideKeyboard).toHaveBeenCalledTimes(1);
    expect(component.enteredTags).toEqual(['C#']);
    expect(component.customTag).toBe('');
  });

  it('On call initDataItems should set tagItems', () => {
    const tagList = ['java', 'c'];
    component.tagsAutoComplete = tagList;
    component.initDataItems();

    const tagItems = new ObservableArray<TokenModel>();
    for (let i = 0; i < tagList.length; i++) {
      tagItems.push(new TokenModel(tagList[i], undefined));
    }
    expect(component.tagItems).toEqual(tagItems);
  });

  it('On call onDidAutoComplete it should set customTag', () => {
    const args = { text: 'Angular' };
    component.onDidAutoComplete(args);
    expect(component.customTag).toBe('Angular');
  });


  it('On call onTextChanged it should set customTag', () => {
    const args = { text: 'Angular' };
    component.onTextChanged(args);
    expect(component.customTag).toBe('Angular');
  });

  it('On call removeEnteredTag it should remove tag if ', () => {
    const args = { text: 'Angular' };
    component.onTextChanged(args);
    expect(component.customTag).toBe('Angular');
  });

  it('On call setBulkUploadRequest it show error message when form is not valid', () => {
    setUserData();
    component.userForm.get('profilePicture').setValue('/assets/images/default-avatar-small.png');
    const services = TestBed.get(Utils);
    const spyMessage = spyOn(services, 'showMessage');
    component.setBulkUploadRequest();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('On call setBulkUploadRequest it should submit form ', () => {
    setUserData();
    component.userForm.get('name').setValue('Jack');
    component.userForm.get('profilePicture').setValue('/assets/images/default-avatar-small.png');
    const spyOnSubmit = spyOn(component, 'onSubmit');
    component.setBulkUploadRequest();
    expect(spyOnSubmit).toHaveBeenCalled();
  });

  it('On call formEditOpen it should it should set focus on selected textbox', () => {
    setUserData();
    component.userForm.get('name').setValue('Jack');
    component.userForm.get('profilePicture').setValue('/assets/images/default-avatar-small.png');
    const spyEditSingleField = spyOn(component, 'editSingleField');

    const services = TestBed.get(Utils);
    const spyFocusTextField = spyOn(services, 'focusTextField');

    component.formEditOpen('socialProfile');
    expect(spyEditSingleField).toHaveBeenCalled();
    expect(spyFocusTextField).toHaveBeenCalled();
  });

  it('On call formEditOpen it should it should set enable on textbox', () => {
    setUserData();
    component.userForm.get('name').setValue('Jack');
    component.userForm.get('profilePicture').setValue('/assets/images/default-avatar-small.png');
    const spyEditSingleField = spyOn(component, 'editSingleField');

    const services = TestBed.get(Utils);
    const spyFocusTextField = spyOn(services, 'focusTextField');

    component.formEditOpen('displayName');
    expect(spyEditSingleField).toHaveBeenCalled();
    expect(spyFocusTextField).not.toHaveBeenCalled();
  });

  it('On call formEditOpen it should it should set enable on textbox', () => {
    setUserData();
    component.userForm.get('name').setValue('Jack');
    component.userForm.get('profilePicture').setValue('/assets/images/default-avatar-small.png');
    const spyEditSingleField = spyOn(component, 'editSingleField');

    const services = TestBed.get(Utils);
    const spyFocusTextField = spyOn(services, 'focusTextField');

    component.formEditOpen('displayName');
    expect(spyEditSingleField).toHaveBeenCalled();
    expect(spyFocusTextField).not.toHaveBeenCalled();
  });

  it('On call onSubmit it should call editLocationField', () => {
    setUserData();
    const spyEditLocationField = spyOn(component, 'editLocationField');
    const spySetValidation = spyOn(component, 'setValidation');

    component.onSubmit(false, 'location');
    expect(spyEditLocationField).toHaveBeenCalled();
    expect(spySetValidation).toHaveBeenCalled();
  });

  it('On call onSubmit it should call displayName', () => {
    setUserData();
    const spyCheckDisplayName = spyOn(component, 'checkDisplayName');
    component.userForm.get('displayName').setValue('ss');
    component.onSubmit(false, 'displayName');
    expect(spyCheckDisplayName).toHaveBeenCalled();
  });

  it('On call hideKeyboard it should hide keyboard', () => {
    const services = TestBed.get(Utils);
    const spyHideKeyboard = spyOn(services, 'hideKeyboard');
    component.hideKeyboard();
    expect(spyHideKeyboard).toHaveBeenCalledTimes(1);
  });


  it('On call openUrl it should open url in browser', () => {
    const spyOpenUrl = spyOn(utils, 'openUrl');
    component.openUrl('https://www.stackoverflow.com/users/', '1245789');
    expect(spyOpenUrl).toHaveBeenCalledTimes(1);
  });

  // TODO test get current location
  it('On call getLocation it should dispatch event for get address', () => {
    // const spyOpenUrl = spyOn(component, 'getLocationPermission');
    // const spyGeolocation = spyOn(geolocation, 'getCurrentLocation').and.callThrough();
    // component.isLocationEnalbed = true;
    // component.getLocation();
    // expect(spyOpenUrl).toHaveBeenCalledTimes(1);
    // expect(spyGeolocation).toHaveBeenCalledTimes(1);
  });

  it('On call openUrl it should open url in browser', () => {
    const spyOnSubmit = spyOn(component, 'onSubmit');
    component.formSubmitted('displayName');
    expect(spyOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('On call redirectToChangePassword it should redirect to update-category-tag', () => {
    const navigate = spyOn(component.router, 'navigate');
    component.redirectToChangePassword();
    expect(navigate).toHaveBeenCalledWith(['/user/my/profile/change-password'], undefined);
  });

  it('On call navigateToPrivacyPolicy it should redirect to privacy-policy', () => {
    const navigate = spyOn(component.router, 'navigate');
    component.navigateToPrivacyPolicy();
    expect(navigate).toHaveBeenCalledWith(['/privacy-policy'], undefined);
  });

  it('On call navigateToTermsConditions it should redirect to terms-and-conditions', () => {
    const navigate = spyOn(component.router, 'navigate');
    component.navigateToTermsConditions();
    expect(navigate).toHaveBeenCalledWith(['/terms-and-conditions'], undefined);
  });


  it('On call navigateToUserFeedback it should redirect to user-feedback', () => {
    const navigate = spyOn(component.router, 'navigate');
    component.navigateToUserFeedback();
    expect(navigate).toHaveBeenCalledWith(['/user-feedback'], undefined);
  });




});
