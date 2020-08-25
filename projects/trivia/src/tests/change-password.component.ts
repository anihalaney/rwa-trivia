import 'reflect-metadata';
import { ChangePasswordComponent } from 'shared-library/shared/mobile/component/change-password/change-password.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, UIStateActions } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { RouterExtensions } from 'nativescript-angular/router';
import { of } from 'rxjs';

describe('ChangePasswordComponent', async () => {

    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let user: User;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const applicationSettings: any[] = [];

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([ChangePasswordComponent], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { }
            }
        },
        FormBuilder,
        UserActions,
        UIStateActions,
        {
            provide: FirebaseAuthService,
            useValue: {

                authState() {
                    return of();
                }
            }
        },
        {
            provide: AuthenticationProvider,
            useValue: {
                updatePassword() {
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
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(ChangePasswordComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set user', () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it('On click back it should redirect to previous screen', () => {
        const routerExtensions = TestBed.get(RouterExtensions);
        const spyOnShowMessage = spyOn(routerExtensions, 'back').and.returnValue('');
        component.back();
        expect(spyOnShowMessage).toHaveBeenCalledTimes(1);
    });

    it('On call save button it should update password', () => {
        user = { ...testData.userList[0] };
        user.authState = {
            providerData: [{
                'displayName': 'Iron man',
                'email': 'ironman@gmail.com',
                'phoneNumber': null,
                'photoURL': null,
                'providerId': 'password',
                'uid': 'ironman@gmail.com'
            }]
        } as any;
        const authProvider = TestBed.get(AuthenticationProvider);
        const spyOnUpdatePassword = spyOn(authProvider, 'updatePassword').and.returnValue('');

        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.passwordForm.get('oldPassword').setValue('123456');
        component.passwordForm.get('password').setValue('789456');
        component.saveUser();
        expect(spyOnUpdatePassword).toHaveBeenCalledTimes(1);
    });

    it('User form should have passwordmismatch when password and confirmPassword not same', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.passwordForm.controls.password.enable();
        component.passwordForm.controls.confirmPassword.enable();
        component.passwordForm.controls.password.setValue('123456');
        component.passwordForm.controls.confirmPassword.setValue('456789');
        expect(component.passwordForm.hasError('passwordmismatch')).toBeTruthy();
    });

    it('User form should have requiredoldpassword when oldpassword is empty', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.passwordForm.controls.oldPassword.enable();
        component.passwordForm.controls.password.enable();
        component.passwordForm.controls.confirmPassword.enable();
        component.passwordForm.controls.password.setValue('123456');
        component.passwordForm.controls.confirmPassword.setValue('123456');
        component.passwordForm.controls.oldPassword.setValue(null);
        expect(component.passwordForm.hasError('requiredoldpassword')).toBeTruthy();
    });


    it('profileUpdateFormValidator should return null when password, confirmPassword and oldPassword value is valid', () => {
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        applicationSettings.push(testData.applicationSettings);
        mockCoreSelector.setResult({ user, account: user.account, applicationSettings, userDict });
        mockStore.refreshState();
        fixture.detectChanges();
        component.passwordForm.controls.oldPassword.enable();
        component.passwordForm.controls.password.enable();
        component.passwordForm.controls.confirmPassword.enable();
        component.passwordForm.controls.password.setValue('123456');
        component.passwordForm.controls.confirmPassword.setValue('123456');
        component.passwordForm.controls.oldPassword.setValue('456789');
        expect(component.passwordForm.hasError('passwordmismatch')).toBeFalsy();
        expect(component.passwordForm.hasError('requiredoldpassword')).toBeFalsy();
    });

    it('Form should have min length error if old password and password have less then 6 characters', () => {
        component.passwordForm.controls.oldPassword.setValue('12');
        component.passwordForm.controls.password.setValue('12');
        component.passwordForm.controls.confirmPassword.setValue('12');
        expect(component.passwordForm.get('oldPassword').errors).toEqual({ minlength: { requiredLength: 6, actualLength: 2 } });
        expect(component.passwordForm.get('password').errors).toEqual({ minlength: { requiredLength: 6, actualLength: 2 } });
        expect(component.passwordForm.get('confirmPassword').errors).toEqual({ minlength: { requiredLength: 6, actualLength: 2 } });
    });


});
