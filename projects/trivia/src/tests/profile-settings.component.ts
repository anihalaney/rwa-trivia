import 'reflect-metadata';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
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
import { User, profileSettingsConstants } from 'shared-library/shared/model';
import {
  AppState, appState, categoryDictionary,
  getCategories,
  getTags
} from './../app/store';
import { userState } from './../app/user/store';
import { Router } from '@angular/router';
import { Utils } from 'shared-library/core/services';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CoreState, UserActions, UIStateActions, coreState, getTopTopics } from 'shared-library/core/store';
import { CheckDisplayNameComponent } from 'shared-library/shared/components';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import * as utils from 'tns-core-modules/utils/utils';

import { ImageSource } from 'tns-core-modules/image-source';


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
          },
          getImageUrl() {
            return true;
          },
          regExpEscape(s) {
            return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
              replace(/\x08/g, '\\x08');
          }
        }
      },
      UserActions,
      UIStateActions,
      {
        provide: AuthenticationProvider,
        useValue: {
          firebaseAuthState,
          updatePassword(email: string, currentPassword: string, newPassword: string) {
            return true;
          }
        }
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

  // Common component
  // tslint:disable-next-line: max-line-length
  it('Verify data of applicationSettings, socialProfileObj, socialProfileSettings and enableSocialProfile from initializeSocialSetting function', () => {
    user = { ...testData.userList[0] };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    mockStore.refreshState();
    fixture.detectChanges();
    component.initializeSocialSetting().subscribe();
    // Expected social profile settings
    const expectedSocialProfileSettings = applicationSettings[0].social_profile
      .filter(profile =>
        user &&
        user[profile.social_name]
        && user[profile.social_name] !== '');
    // Expected enable social profile
    const expectedEnableSocialProfile = expectedSocialProfileSettings.filter(profile => profile.enable).length;
    expect(component.applicationSettings).toEqual(applicationSettings[0]);
    expect(component.socialProfileObj).toEqual(applicationSettings[0].social_profile);
    expect(component.socialProfileSettings).toEqual(expectedSocialProfileSettings);
    expect(component.enableSocialProfile).toEqual(expectedEnableSocialProfile);
  });

  it('Verify enableSocialProfile length from showAllSocialSetting function', () => {
    applicationSettings.push(testData.applicationSettings);
    component.socialProfileObj = applicationSettings[0].social_profile;
    component.showAllSocialSetting();
    expect(component.enableSocialProfile).toBe(5);
  });

  it('Verify getIcon function', () => {
    const expectedIcon = String.fromCharCode(parseInt(`0x${100}`, 16));
    expect(component.getIcon(100)).toEqual(expectedIcon);
  });

  it('Verify account, categories, categoryDict, topics and userCopyForReset data from initializeUserProfile function', () => {
    user = { ...testData.userList[0] };
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.account).toEqual(user.account);
    expect(component.categories).toEqual(testData.categoryList);
    expect(component.categoryDict).toEqual(testData.categoryDictionary);
    expect(component.topics).toEqual(testData.topTopics as any);
    expect(component.userCopyForReset).toEqual(user);
  });

  it('Verify bulkUploadBtnText when bulkUploadPermissionStatus NONE', () => {
    user = { ...testData.userList[0] };
    user.bulkUploadPermissionStatus = 'none';
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.bulkUploadBtnText).toEqual(profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT);
  });

  it('Verify bulkUploadBtnText when bulkUploadPermissionStatus PENDING', () => {
    user = { ...testData.userList[0] };
    user.bulkUploadPermissionStatus = 'pending';
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.bulkUploadBtnText).toEqual(profileSettingsConstants.BULK_UPLOAD_SEND_REQUEST_AGAIN_BTN_TEXT);
  });

  it('Verify bulkUploadPermissionStatus when user role is BulkUploader', () => {
    user = { ...testData.userList[0] };
    user.roles = {
      'bulkuploader': { bulkuploader: true, admin: false }
    };
    getCategories.setResult(testData.categoryList);
    categoryDictionary.setResult(testData.categoryDictionary);
    getTopTopics.setResult(testData.topTopics as any);
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.user.bulkUploadPermissionStatus).toEqual(profileSettingsConstants.APPROVED);
  });

  it('Verify currentAuthProvider data when user authState providerData length is greater than 0', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    component.setUserAuthProvider(user);
    expect(component.currentAuthProvider).toEqual(user.authState.providerData[0].providerId);
  });

  it('Verify currentAuthProvider data when user authState providers length is greater than 1', () => {
    const userProvider = { ...testData.userList[0] };
    userProvider.authState = {
      providers: [{}, {
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'id': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    };
    component.setUserAuthProvider(userProvider);
    expect(component.currentAuthProvider).toEqual(userProvider.authState.providers[1].id);
  });

  it('Verify currentAuthProvider data when user authState providers length is equal to 1', () => {
    const userProvider = { ...testData.userList[0] };
    userProvider.authState = {
      providers: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'id': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    };
    component.setUserAuthProvider(userProvider);
    expect(component.currentAuthProvider).toEqual(userProvider.authState.providers[0].id);
  });

  it('Verify other user profile data', () => {
    user = { ...testData.userList[1] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    mockCoreSelector.setResult({ user, account: user.account, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.user).toEqual(user);
    expect(component.account).toEqual(user.account);
    expect(component.gamePlayedAgainst).toEqual(user.gamePlayed);
    const userProfileImageURL = component.getImageUrl(user);
    expect(component.userProfileImageUrl).toEqual(userProfileImageURL);
  });

  it('Verify createform() function works correctly', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    fixture.detectChanges();
    component.setUserAuthProvider(user);
    component.createForm(user);
    expect(component.userForm.controls.name).not.toBeUndefined();
    expect(component.userForm.controls.displayName).not.toBeUndefined();
    expect(component.userForm.controls.location).not.toBeUndefined();
    expect(component.userForm.controls.categoryList).not.toBeUndefined();
    expect(component.userForm.controls.topicList).not.toBeUndefined();
    expect(component.userForm.controls.tags).not.toBeUndefined();
    expect(component.userForm.controls.tagsArray).not.toBeUndefined();
    expect(component.userForm.controls.profilePicture).not.toBeUndefined();
    expect(component.userForm.controls.email).not.toBeUndefined();
    expect(component.userForm.controls.phoneNo).not.toBeUndefined();
    expect(component.userForm.controls.oldPassword).not.toBeUndefined();
    expect(component.userForm.controls.password).not.toBeUndefined();
    expect(component.userForm.controls.confirmPassword).not.toBeUndefined();
  });

  it('Set GOOGLE as currentAuthProvider and Verify phoneNo should not be undefined', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'google.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    fixture.detectChanges();
    component.setUserAuthProvider(user);
    component.createForm(user);
    expect(component.userForm.controls.phoneNo).not.toBeUndefined();
  });

  it('Set FACEBOOK as currentAuthProvider and Verify phoneNo should not be undefined', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'facebook.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    fixture.detectChanges();
    component.setUserAuthProvider(user);
    component.createForm(user);
    expect(component.userForm.controls.phoneNo).not.toBeUndefined();
  });

  it('Set APPLE as currentAuthProvider and Verify phoneNo should not be undefined', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'apple.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    fixture.detectChanges();
    component.setUserAuthProvider(user);
    component.createForm(user);
    expect(component.userForm.controls.phoneNo).not.toBeUndefined();
  });

  it('Set PHONE as currentAuthProvider and Verify phoneNo should not be undefined', () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'phone',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    fixture.detectChanges();
    component.setUserAuthProvider(user);
    component.createForm(user);
    expect(component.userForm.controls.phoneNo).not.toBeUndefined();
  });

  it('Verify getUserFromFormValue function works correctly when isEditSingleField is true', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(true, 'displayName');
    expect(component.userForm.get('displayName').value).toEqual(user['displayName']);
  });

  it('Verify getUserFromFormValue function works correctly when isEditSingleField is true and field name is socialProfile', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(true, 'socialProfile');
    applicationSettings[0].social_profile.map(profile => {
      if (profile.enable) {
        expect(component.userForm.get(profile.social_name).value).toEqual(user[profile.social_name]);
      }
    });
  });

  it('Verify getUserFromFormValue function works correctly when isEditSingleField is false and field value is empty', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(false, '');
    expect(component.userForm.get('name').value).toEqual(user['name']);
    expect(component.userForm.get('profilePicture').value).toEqual(user['profilePicture'] ? user['profilePicture'] : null);
    expect(component.userForm.get('email').value).toEqual(user['email']);
    expect(component.userForm.get('phoneNo').value).toEqual(user['phoneNo']);
    applicationSettings[0].social_profile.map(profile => {
      if (profile.enable) {
        expect(component.userForm.get(profile.social_name).value).toEqual(user[profile.social_name]);
      }
    });
  });

  it('Verify phoneNo value when currentAuthProvider is GOOGLE in getUserFromFormValue function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'google.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(false, '');
    expect(component.userForm.get('phoneNo').value).toEqual(user['phoneNo']);
  });

  it('Verify phoneNo value when currentAuthProvider is FACEBOOK in getUserFromFormValue function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'facebook.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(false, '');
    expect(component.userForm.get('phoneNo').value).toEqual(user['phoneNo']);
  });

  it('Verify phoneNo value when currentAuthProvider is APPLE in getUserFromFormValue function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'apple.com',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(false, '');
    expect(component.userForm.get('phoneNo').value).toEqual(user['phoneNo']);
  });

  it('Verify phoneNo value when currentAuthProvider is PHONE in getUserFromFormValue function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'phone',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.getUserFromFormValue(false, '');
    expect(component.userForm.get('phoneNo').value).toEqual(user['phoneNo']);
  });

  it('Verify saveUserInformation function it should dispatch action to add user data in user profile', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.saveUserInformation(user, false);
    expect(spy).toHaveBeenCalledWith(
      new UserActions().addUserProfile(user, false)
    );
  });

  it('Verify resetUserProfile function works correctly', () => {
    user = { ...testData.userList[0] };
    // component.createForm = jest.fn();
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.resetUserProfile();
    expect(component.user).toEqual(user);
  });

  it('Set PASSWORD as currentAuthProvider and verify saveUser function work correctly', async () => {
    user = { ...testData.userList[0] };
    user.authState = {
      providerData: [{
        'displayName': 'Priyanka 124',
        'email': 'priyankamavani99+124@gmail.com',
        'phoneNumber': null,
        'photoURL': null,
        'providerId': 'password',
        'uid': 'priyankamavani99+124@gmail.com'
      }]
    } as any;

    const spySaveUserInformation = spyOn(component, 'saveUserInformation');
    const services = TestBed.get(AuthenticationProvider);
    const spyUpdatePassword = spyOn(services, 'updatePassword');
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.userForm.get('oldPassword').setValue('123456');
    component.userForm.get('password').setValue('789456');
    component.saveUser(user, false);
    expect(await spyUpdatePassword).toHaveBeenCalledTimes(1);
    expect(spySaveUserInformation).toHaveBeenCalledTimes(1);
  });


  it('Set isDisableAll true and Verify disableForm function work correctly', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.disableForm(true);
    expect(component.userForm.disable).toBeTruthy();
  });

  it('Verify editProfile function work correctly', () => {
    const spyShowAllSocialSetting = spyOn(component, 'showAllSocialSetting');
    const spyEnableForm = spyOn(component, 'enableForm');
    component.editProfile();
    expect(spyShowAllSocialSetting).toHaveBeenCalledTimes(1);
    expect(spyEnableForm).toHaveBeenCalledTimes(1);
  });


  it('Verify checkDisplayName action should be dispatched', () => {
    user = { ...testData.userList[0] };
    component.checkDisplayName(user.displayName);
    expect(spy).toHaveBeenCalledWith(
      new UserActions().checkDisplayName(user.displayName)
    );
  });

  it('Verify changedLocation function work correctly', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.changedLocation([]);
    expect(component.user.isAutoComplete).toBe(true);
  });

  it('Verify editSingleField function when singleFieldEdit object true', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.editSingleField('displayName');
    expect(component.userForm.controls.displayName.enabled).toBeTruthy();
    let errors = {};
    const displayName = component.userForm.controls.displayName;
    displayName.setValue(null);
    errors = displayName.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('Verify editSingleField function when singleFieldEdit object false', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    component.singleFieldEdit['displayName'] = true;
    fixture.detectChanges();
    component.editSingleField('displayName');
    expect(component.userForm.controls.displayName.disabled).toBeTruthy();
  });

  it('Verify socialProfileSettings in editSingleField function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.editSingleField('socialProfile');
    const socialProfileSettings = applicationSettings[0].social_profile.filter(
      profile =>
        user &&
        user[profile.social_name] &&
        user[profile.social_name] !== ''
    );
    expect(component.socialProfileSettings).toEqual(socialProfileSettings);
  });

  it('Verify email field validators in editSingleField function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.editSingleField('email');
    component.userForm.controls.email.enable();
    let errors = {};
    const email = component.userForm.controls.email;
    // Required field validation check
    email.setValue(null);
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    // Pattern validation check
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();
  });

  it('Verify phoneNo field validators in editSingleField function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.editSingleField('phoneNo');
    component.userForm.controls.phoneNo.enable();
    let errors = {};
    const phoneNo = component.userForm.controls.phoneNo;
    // Required field validation check
    phoneNo.setValue(null);
    errors = phoneNo.errors || {};
    expect(errors['required']).toBeTruthy();
    // Pattern validation check
    phoneNo.setValue('test');
    errors = phoneNo.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });

  it('Verify getCityAndCountryName function works correctly', () => {
    const location = {
      results: [{
        address_components: [
          {
            long_name: 'F Block',
            short_name: 'F Block',
            types: ['premise']
          },
          {
            long_name: 'Sherkotda',
            short_name: 'Sherkotda',
            types: ['political', 'sublocality', 'sublocality_level_1']
          },
          {
            long_name: 'Ahmedabad',
            short_name: 'Ahmedabad',
            types: ['locality', 'political']
          },
          {
            long_name: 'Ahmedabad',
            short_name: 'Ahmedabad',
            types: ['administrative_area_level_2', 'political']
          },
          {
            long_name: 'Gujarat',
            short_name: 'GJ',
            types: ['administrative_area_level_1', 'political']
          },
          {
            long_name: 'India',
            short_name: 'IN',
            types: ['country', 'political']
          },
          {
            long_name: '380002',
            short_name: '380002',
            types: ['postal_code']
          }
        ]
      }]
    };
    expect(component.getCityAndCountryName(location)).toEqual('Ahmedabad,Gujarat');
  });

  it('In setValidation function, verify that field is included in singleFieldEdit or not', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    component.singleFieldEdit['displayName'] = true;
    fixture.detectChanges();
    component.setValidation('displayName');
    expect(component.userForm.controls.displayName.enabled).toBeTruthy();
    let errors = {};
    const displayName = component.userForm.controls.displayName;
    displayName.setValue(null);
    errors = displayName.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('Verify setValidation function when singleFieldEdit object false', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.setValidation('displayName');
    expect(component.userForm.controls.displayName.disabled).toBeTruthy();
  });

  it('Verify socialProfileSettings in setValidation function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.setValidation('socialProfile');
    const socialProfileSettings = applicationSettings[0].social_profile.filter(
      profile =>
        user &&
        user[profile.social_name] &&
        user[profile.social_name] !== ''
    );
    expect(component.socialProfileSettings).toEqual(socialProfileSettings);
  });

  it('Verify email field validators in setValidation function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.setValidation('email');
    component.userForm.controls.email.enable();
    let errors = {};
    const email = component.userForm.controls.email;
    // Required field validation check
    email.setValue(null);
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    // Pattern validation check
    email.setValue('test');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();
  });

  it('Verify phoneNo field validators in setValidation function', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.setValidation('phoneNo');
    component.userForm.controls.phoneNo.enable();
    let errors = {};
    const phoneNo = component.userForm.controls.phoneNo;
    // Required field validation check
    phoneNo.setValue(null);
    errors = phoneNo.errors || {};
    expect(errors['required']).toBeTruthy();
    // Pattern validation check
    phoneNo.setValue('test');
    errors = phoneNo.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });

  it('User form should have passwordmismatch when password and confirmPassword not same', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.userForm.controls.password.enable();
    component.userForm.controls.confirmPassword.enable();
    component.userForm.controls.password.setValue('123456');
    component.userForm.controls.confirmPassword.setValue('456789');
    expect(component.userForm.hasError('passwordmismatch')).toBeTruthy();
  });

  it('User form should have requiredoldpassword when oldpassword is empty', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.userForm.controls.oldPassword.enable();
    component.userForm.controls.password.enable();
    component.userForm.controls.confirmPassword.enable();
    component.userForm.controls.password.setValue('123456');
    component.userForm.controls.confirmPassword.setValue('123456');
    component.userForm.controls.oldPassword.setValue(null);
    expect(component.userForm.hasError('requiredoldpassword')).toBeTruthy();
  });

  it('profileUpdateFormValidator should return null when passwor, confirmPassword and oldPassword value is valid', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.userForm.controls.oldPassword.enable();
    component.userForm.controls.password.enable();
    component.userForm.controls.confirmPassword.enable();
    component.userForm.controls.password.setValue('123456');
    component.userForm.controls.confirmPassword.setValue('123456');
    component.userForm.controls.oldPassword.setValue('456789');
    expect(component.userForm.hasError('passwordmismatch')).toBeFalsy();
    expect(component.userForm.hasError('requiredoldpassword')).toBeFalsy();
  });

  it('Verify filter function work correctly', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    getTags.setResult(testData.tagList);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    expect(component.filter('C#')).toEqual(['C#']);
  });


  it('Verify onSubmit function works correctly', () => {
    const spyOnSaveUser = spyOn(component, 'saveUser');
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    getTags.setResult(testData.tagList);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict, checkDisplayName: true });
    mockStore.refreshState();
    fixture.detectChanges();
    component.onSubmit(false, '');
    expect(spyOnSaveUser).toHaveBeenCalledTimes(1);
  });



  it('Verify saveProfileImage function works correctly', () => {
    const spyOnSaveUser = spyOn(component, 'saveUser');
    const spyOnGetUserFromFormValue = spyOn(component, 'getUserFromFormValue');
    const spyOnAssignImageValues = spyOn(component, 'assignImageValues');

    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    getTags.setResult(testData.tagList);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.saveProfileImage();
    expect(spyOnAssignImageValues).toHaveBeenCalledTimes(1);
    expect(spyOnGetUserFromFormValue).toHaveBeenCalledTimes(1);
    expect(spyOnSaveUser).toHaveBeenCalledTimes(1);
  });

  it('Verify the social profile url is valid or not', () => {
    user = { ...testData.userList[0] };
    const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
    applicationSettings.push(testData.applicationSettings);
    mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
    mockStore.refreshState();
    fixture.detectChanges();
    component.userForm.addControl(
      'linkedInUrl',
      new FormControl('linkedInUrl')
    );
    component.userForm.controls.linkedInUrl.setValue('www.linkedin.com');
    expect(component.ValidateUrl(component.userForm.controls.linkedInUrl)).toEqual({ validUrl: true });
  });

  it('Verify the on call changeProfilePictureFromCamera it should call cropImage function', fakeAsync(async () => {
    // tslint:disable-next-line: max-line-length
    const imageSource = ImageSource.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    const spyOnIsCameraAvailable = spyOn(component, 'isCameraAvailable').and.returnValue(true);
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnTakePicture = spyOn(component, 'takePicture').and.returnValue(Promise.resolve({ imageSource }));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    component.changeProfilePictureFromCamera();
    await spyOnTakePicture.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);
  }));


  it('Verify the on call cropImage it should save image', fakeAsync(async () => {
    // tslint:disable-next-line: max-line-length
    const imageSource = ImageSource.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

    const spyGetCroppedImage = spyOn(component, 'getCroppedImage').and.returnValue(Promise.resolve({
      toBase64String: () => {
        return '';
      }
    }));

    const spyOnSaveProfileImage = spyOn(component, 'saveProfileImage').and.returnValue('');
    component.cropImage(imageSource);
    await spyGetCroppedImage.calls.mostRecent().returnValue;
    expect(spyOnSaveProfileImage).toHaveBeenCalledTimes(1);

  }));

  it('Verify the on call cropImage it should save image', fakeAsync(async () => {
    const spyGetCroppedImage = spyOn(component, 'contextSelection').and.returnValue(Promise.resolve([{
      imageAsset: {}
    }]));
    const spyOnFromAsset = spyOn(component, 'fromAsset').and.returnValue(Promise.resolve(true));
    const spyOnCropImage = spyOn(component, 'cropImage').and.returnValue('');

    component.changeProfilePictureFromGallery();
    await spyGetCroppedImage.calls.mostRecent().returnValue;
    await spyOnFromAsset.calls.mostRecent().returnValue;
    tick(500);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnCropImage).toHaveBeenCalledTimes(1);

  }));

  it('Verify the on call onTakePhoto it should get image from camera', fakeAsync(async () => {
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Camera'));
    const spyChangeProfilePictureFromCamera = spyOn(component, 'changeProfilePictureFromCamera').and.returnValue('');
    component.onTakePhoto();
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(spyChangeProfilePictureFromCamera).toHaveBeenCalledTimes(1);
  }));

  it('Verify the on call onTakePhoto it should get image from gallery', fakeAsync(async () => {
    const spyOpenDialog = spyOn(component, 'openDialog').and.returnValue(Promise.resolve('Gallery'));
    const changeProfilePictureFromGallery = spyOn(component, 'changeProfilePictureFromGallery').and.returnValue('');
    component.onTakePhoto();
    await spyOpenDialog.calls.mostRecent().returnValue;
    expect(changeProfilePictureFromGallery).toHaveBeenCalledTimes(1);
  }));



});
