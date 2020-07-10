import { ProfileSettingsComponent } from './profile-settings.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import {
    AppState, appState, categoryDictionary,
    getCategories,
    getTags
} from '../../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { CoreState, UserActions, UIStateActions, coreState, getTopTopics } from 'shared-library/core/store';
import { Store, MemoizedSelector } from '@ngrx/store';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MatDialogModule, MatSnackBarModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { Utils, WindowRef } from 'shared-library/core/services';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { User, profileSettingsConstants } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { CheckDisplayNameComponent } from 'shared-library/shared/components';
import { ImageCropperComponent } from 'ngx-img-cropper';


describe('ProfileSettingsComponent', () => {
    window.scrollTo = jest.fn();
    let component: ProfileSettingsComponent;
    let fixture: ComponentFixture<ProfileSettingsComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    const firebaseAuthService: FirebaseAuthService = null;
    const store: Store<CoreState> = null;
    const applicationSettings: any[] = [];
    let user: User;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
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

    beforeEach(async(() => {
        // create new instance of FormBuilder
        const formBuilder: FormBuilder = new FormBuilder();

        TestBed.configureTestingModule({
            declarations: [ProfileSettingsComponent, CheckDisplayNameComponent ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule,
                MatInputModule, MatSnackBarModule, RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule, MatDialogModule],
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        }
                    ]
                }),
                Utils,
                {
                    provide: WindowRef,
                    useValue: {
                        nativeWindow: {
                            scrollTo() {}
                        },
                        getNavigatorGeolocation() {
                            return {
                                getCurrentPosition(callback) {
                                    callback( {
                                    coords: {
                                        latitude: 51.1,
                                        longitude: 45.3
                                    }});
                                }
                            };
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
                { provide: FormBuilder, useValue: formBuilder },
            ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(ProfileSettingsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('User default value should be undefined', () => {
        expect(component.user).toBe(undefined);
    });

        it('Verify if userProfileSaveStatus SUCCESS', () => {
            component.setNotificationMsg = jest.fn();
            mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
                userProfileSaveStatus: 'SUCCESS'
            });
            mockStore.refreshState();
            fixture.detectChanges();
            expect(component.setNotificationMsg).toHaveBeenCalled();
        });

    it('Verify if userProfileSaveStatus is not equal to SUCCESS && NONE && IN PROCESS && MAKE FRIEND SUCCESS', () => {
        component.setNotificationMsg = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
            userProfileSaveStatus: 'ERROR'
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.setNotificationMsg).toHaveBeenCalled();
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

    it('Verify locationChanged function', () => {
        user = { ...testData.userList[0] };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();
        component.locationChanged('Ahmedabad, Gujarat');
        expect(spy).toHaveBeenCalledWith(
            new UserActions().loadAddressSuggestions('Ahmedabad, Gujarat')
        );
    });

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

    it('Verify other user invitations dispatch action to get UserInvitationsInfo', () => {
        user = { ...testData.userList[1] };
        const userInvitation = {
            'data6@data.com': {
                created_uid: 'tcXk4xS1EfYZ0TrNrBAi6HOKQOW2',
                email: 'data6@data.com',
                id: 'OYXPXnqU2ua2mwXlbRHT',
                status: 'pending'
            }
        };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict, userFriendInvitations: userInvitation });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.userInvitations).toEqual(userInvitation);
        expect(spy).toHaveBeenCalledWith(
            new UserActions().loadUserInvitationsInfo('yP7sLu5TmYRUO9YT4tWrYLAqxSz1', user.email, user.userId)
        );
    });

    it('Verify that other user account info should be set in loggedInUserAccount', () => {
        user = { ...testData.userList[1] };
        const userInvitation = {
            'data6@data.com': {
                created_uid: 'tcXk4xS1EfYZ0TrNrBAi6HOKQOW2',
                email: 'data6@data.com',
                id: 'OYXPXnqU2ua2mwXlbRHT',
                status: 'pending'
            }
        };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict, userFriendInvitations: userInvitation });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.loggedInUserAccount).toEqual(user.account);
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
        component.saveUserInformation = jest.fn();
        component.authenticationProvider.updatePassword = jest.fn();
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.userForm.get('oldPassword').setValue('123456');
        component.userForm.get('password').setValue('789456');
        component.saveUser(user, false);
        expect(await component.authenticationProvider.updatePassword).toHaveBeenCalledTimes(1);
        expect(component.saveUserInformation).toHaveBeenCalledTimes(1);
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
        component.showAllSocialSetting = jest.fn();
        component.enableForm = jest.fn();
        component.editProfile();
        expect(component.showAllSocialSetting).toHaveBeenCalledTimes(1);
        expect(component.enableForm).toHaveBeenCalledTimes(1);
    });

    it('Verify socialProfileShowLimit in showMoreSocialProfile function', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.showMoreSocialProfile();
        const enableSocialProfile = component.socialProfileSettings.filter(
            profile => profile.enable
        ).length;
        expect(component.socialProfileShowLimit).toEqual(enableSocialProfile);
    });

    it('displayName and location field should be disabled when enableForm function call', () => {
        user = { ...testData.userList[0] };
        component.createForm(user);
        component.enableForm();
        expect(component.userForm.controls.displayName.enable()).toBeFalsy();
        expect(component.userForm.controls.location.enable()).toBeFalsy();
    });

    it('Verify checkDisplayName action should be dispatched', () => {
        user = { ...testData.userList[0] };
        component.checkDisplayName(user.displayName);
        expect(spy).toHaveBeenCalledWith(
            new UserActions().checkDisplayName(user.displayName)
        );
    });

    it('Verify startNewGame function work correctly', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.router.navigate = jest.fn();
        component.startNewGame();
        expect(component.router.navigate).toHaveBeenCalledTimes(1);
        expect(component.router.navigate).toHaveBeenCalledWith(['/game-play/challenge/', user.userId]);
    });

    it('Verify addUserInvitation action should be dispatched from sendFriendRequest function', () => {
        user = { ...testData.userList[1] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.sendFriendRequest();
        expect(spy).toHaveBeenCalledWith(
            new UserActions().addUserInvitation({ userId: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1', inviteeUserId: user.userId })
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
        component.saveUser = jest.fn();
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        getTags.setResult(testData.tagList);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict, checkDisplayName: true });
        mockStore.refreshState();
        fixture.detectChanges();
        component.onSubmit(false, '');
        expect(component.saveUser).toHaveBeenCalledTimes(1);
    });

    it('Verify onFileChange function works correctly', () => {
        // mock image cropper , second argument is passed undefined as we do not need to render anything
        component.cropper = new ImageCropperComponent(undefined);
        component.cropper.setImage = jest.fn();
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        getTags.setResult(testData.tagList);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        // do not uncomment this, in this test case fixture.detectChanges()
        // messes with mocked cropper
        // fixture.detectChanges();
        const $event = {
            target: {
                files: [new File([
                    new ArrayBuffer(2e+5)],
                    'Mac_Apple.jpg',
                    {
                        lastModified: null,
                        type: 'image/jpeg',
                    })]
            }
        };
        component.onFileChange($event);
        expect(component.profileImageValidation).toBe(undefined);
    });

    it('Verify saveProfileImage function works correctly', () => {
        component.enableForm = jest.fn();
        component.getUserFromFormValue = jest.fn();
        component.disableForm = jest.fn();
        component.assignImageValues = jest.fn();
        component.saveUser = jest.fn();
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        getTags.setResult(testData.tagList);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.saveProfileImage();
        expect(component.enableForm).toHaveBeenCalledTimes(1);
        expect(component.getUserFromFormValue).toHaveBeenCalledTimes(1);
        expect(component.disableForm).toHaveBeenCalled();
        expect(component.assignImageValues).toHaveBeenCalledTimes(1);
        expect(component.saveUser).toHaveBeenCalledTimes(1);
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

    it('Verify getLocation function work correctly', () => {
        user = { ...testData.userList[0] };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, applicationSettings, account: user.account });
        mockStore.refreshState();
        component.getLocation();
        expect(spy).toHaveBeenCalledWith(
            new UserActions().loadAddressUsingLatLong('51.1,45.3')
        );
    });
});
