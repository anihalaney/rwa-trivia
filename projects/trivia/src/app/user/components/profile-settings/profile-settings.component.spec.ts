import { ProfileSettingsComponent } from './profile-settings.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppState, appState } from '../../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreState, UserActions, UIStateActions, coreState } from 'shared-library/core/store';
import { MemoizedSelector, Store, StoreModule } from '@ngrx/store';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MatDialogModule, MatSnackBarModule, MatAutocompleteModule } from '@angular/material';
import { Utils, WindowRef } from 'shared-library/core/services';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';

describe('ProfileSettingsComponent', () => {
    window.scrollTo = jest.fn();
    let component: ProfileSettingsComponent;
    let fixture: ComponentFixture<ProfileSettingsComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    const firebaseAuthService: FirebaseAuthService = null;
    const store: Store<CoreState> = null;
    let user: User;
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

    const mockGeolocation = {
        getCurrentPosition: jest.fn()
            .mockImplementationOnce(success => Promise.resolve(success({
                coords: {
                    latitude: 51.1,
                    longitude: 45.3
                }
            })))
    };
    const navigator =  {geolocation: null};
    navigator.geolocation = mockGeolocation;

    beforeEach(async(() => {
        // create new instance of FormBuilder
        const formBuilder: FormBuilder = new FormBuilder();

        TestBed.configureTestingModule({
            declarations: [ProfileSettingsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ReactiveFormsModule, FormsModule, StoreModule.forRoot({}), MatSnackBarModule, MatAutocompleteModule,
                RouterTestingModule.withRoutes([]), HttpClientModule, BrowserAnimationsModule, MatDialogModule],
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
                // { provide: WindowRef, useValue: windowRef },
                WindowRef,
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
        spy = spyOn(mockStore, 'dispatch');
        const getGeoLocation = spyOn(navigator.geolocation, 'getCurrentPosition');

        component = fixture.debugElement.componentInstance;
        // router = TestBed.get(Router);
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

    it('Verify if userProfileSaveStatus is not equle to SUCCESS && NONE && IN PROCESS && MAKE FRIEND SUCCESS', () => {
        component.setNotificationMsg = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(coreState, {
            userProfileSaveStatus: 'ERROR'
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.setNotificationMsg).toHaveBeenCalled();
    });

    it('Verify getLocation function works', () => {
        component.userAction.loadAddressUsingLatLong = jest.fn();
        navigator.geolocation.getCurrentPosition(position => console.log('spec file position ==>', position));
        fixture.detectChanges();
        component.getLocation();
    });
});
