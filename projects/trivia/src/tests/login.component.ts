import 'reflect-metadata';
import { LoginComponent } from 'shared-library/core/components/login/login.component.tns';
import { Utils } from 'shared-library/core/services/utils';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NSLocationStrategy, NativeScriptRouterModule } from 'nativescript-angular/router';
import { coreState, CoreState, UIStateActions } from 'shared-library/core/store';
import { AppState } from '../app/store';
import { Router } from '@angular/router';
import { User } from 'shared-library/shared/model';
import { FirebaseAuthService } from 'shared-library/core/auth/firebase-auth.service';
import { PhoneNumberValidationProvider } from 'shared-library/shared/mobile/component/countryList/phone-number-validation.provider';
import { ShowHintWhenFocusOutDirective } from 'shared-library/shared/directive/show-hint-when-focus-out.directive';
import { ActionWithPayload } from '../../../shared-library/src/lib/core/store';


describe('LoginComponent', () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let spy: any;
    let user: User;
    let service: any;

    afterAll(() => { });

    beforeEach(nsTestBedBeforeEach([LoginComponent, ShowHintWhenFocusOutDirective], [
        {
            provide: Utils,
            useValue: {
                focusTextField() {
                    return '';
                },
                showMessage(type: string, message: string) {
                    return '';
                },
                hideKeyboard() {
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
        NSLocationStrategy,
        ModalDialogService,
        UIStateActions,
        {

            provide: FirebaseAuthService,
            useValue: {
                googleLogin() { },
                facebookLogin() { },
                appleLogin() { },
                twitterLogin() { },
                phoneLogin() { },
                signInWithEmailAndPassword(email, password) { },
                createUserWithEmailAndPassword(email, password) { },
                sendEmailVerification(user) { },
                sendPasswordResetEmail(email) { }
            }
        },
        PhoneNumberValidationProvider,
    ],

        [StoreModule.forRoot({}), [ReactiveFormsModule, NativeScriptFormsModule, RouterTestingModule.withRoutes([]),
            NativeScriptRouterModule.forRoot([])]]

    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(LoginComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        service = TestBed.get(FirebaseAuthService);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Verify on call onSubmit it should show error message if form is not filled', () => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        component.onSubmit();
        expect(spyMessage).toHaveBeenCalledWith('error', 'Please Fill the details');
    });

    it('Verify on call onSubmit it should show error message to accept T&D when user sign up', () => {

        component.loginForm.get('email').setValue('test@test.com');
        component.loginForm.get('password').setValue('123456');
        component.loginForm.get('confirmPassword').setValue('123456');
        component.mode = 1;
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        component.onSubmit();
        expect(spyMessage).toHaveBeenCalledWith('error', 'Please accept terms & conditions');
    });

    // tslint:disable-next-line: max-line-length
    it('User submit details for login then it should signInWithEmailAndPassword function to login into system and modal dialog should close ', fakeAsync(() => {

        spyOn(service, 'signInWithEmailAndPassword').and.returnValue(Promise.resolve(testData.userList[0]));
        const spyRedirectTo = spyOn(component, 'redirectTo').and.callFake(() => { });
        component.mode = 0;
        component.setValidatorForLogin();
        component.loginForm.get('email').setValue('demo@demo.com');
        component.loginForm.get('password').setValue('demodemo');
        component.onSubmit();
        tick(100);
        expect(service.signInWithEmailAndPassword).toHaveBeenCalled();
        expect(spyRedirectTo).toHaveBeenCalled();
        flush();
    }));

    // tslint:disable-next-line: max-line-length
    it('User submit details for signup then it should createUserWithEmailAndPassword function to singup into system and modal dialog should close ', fakeAsync(() => {

        spyOn(service, 'createUserWithEmailAndPassword').and.returnValue(Promise.resolve(testData.userList[0]));
        spyOn(service, 'sendEmailVerification').and.returnValue(Promise.resolve(testData.userList[0]));
        const spyRedirectTo = spyOn(component, 'redirectTo').and.callFake(() => { });
        const email = 'demo@demo.com';
        const password = 'demodemo';
        component.mode = 1;
        component.setValidatorForSingUp();
        component.loginForm.get('email').setValue(email);
        component.loginForm.get('password').setValue(password);
        component.loginForm.get('confirmPassword').setValue(password);
        component.loginForm.get('tnc').setValue(true);
        component.onSubmit();
        tick(100);
        expect(service.createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(service.sendEmailVerification).toHaveBeenCalled();
        expect(spyRedirectTo).toHaveBeenCalled();
        flush();
    }));


    // tslint:disable-next-line: max-line-length
    it('User submit for forgot password then it should call function to send mail to reset password link and dispatch event for notification', fakeAsync(() => {

        const email = 'demo@demo.com';
        const payload = [email];

        spyOn(service, 'sendPasswordResetEmail').and.returnValue(Promise.resolve(true));
        spy.and.callFake((action: ActionWithPayload<string[]>) => {
            expect(action.type).toEqual(UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS);
            expect(action.payload).toEqual(payload);
        });
        component.mode = 2;
        component.notificationLogs = [];
        component.setValidatorForForgotPassword();
        component.loginForm.get('email').setValue(email);
        component.onSubmit();
        tick(100);
        expect(service.sendPasswordResetEmail).toHaveBeenCalled();
        expect(component.errorStatus).toBeFalsy();
        expect(mockStore.dispatch).toHaveBeenCalled();
        flush();
        // expect(component.notificationMsg).toBe(`email sent to ${email}`);
    }));

    it('User submit for forgot password if there is any error then it should set error message', fakeAsync(() => {

        const email = 'demo@demo.com';
        const payload = [email];

        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');

        spyOn(service, 'sendPasswordResetEmail').and.returnValue(Promise.reject({ message: 'Something goes wrong.' }));
        spy.and.callFake((action: ActionWithPayload<string[]>) => {
            expect(action.type).toEqual(UIStateActions.RESET_PASSWORD_NOTIFICATION_LOGS);
            expect(action.payload).toEqual(payload);
        });
        component.mode = 2;
        component.notificationLogs = [];
        component.setValidatorForForgotPassword();
        component.loginForm.get('email').setValue(email);
        component.onSubmit();
        tick(1);
        expect(spyMessage).toHaveBeenCalledWith('error', { message: 'Something goes wrong.' });
        flush();
    }));

    it('when user select google login option then it should call google login function to login user', fakeAsync(() => {
        spyOn(service, 'googleLogin');
        component.googleLogin();
        expect(service.googleLogin).toHaveBeenCalled();
        flush();
    }));

    it('when user select google login option and if it return error then it should display the error', fakeAsync(() => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        spyOn(component, 'redirectTo').and.callFake(() => { });
        spyOn(service, 'googleLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
        component.googleLogin();
        expect(service.googleLogin).toHaveBeenCalled();
        tick(100);
        expect(spyMessage).toHaveBeenCalledWith('error', { message: 'something went wrong please try again' });
        flush();
    }));

    it('when user select facebook login option then it should call facebook login function to login user', fakeAsync(() => {
        spyOn(service, 'facebookLogin');
        spyOn(component, 'redirectTo').and.callFake(() => { });
        component.fbLogin();
        expect(service.facebookLogin).toHaveBeenCalled();
        flush();
    }));

    it('when user select apple login option then it should call apple login function to login user', fakeAsync(() => {
        spyOn(service, 'appleLogin');
        spyOn(component, 'redirectTo').and.callFake(() => { });
        component.appleSignIn();
        expect(service.appleLogin).toHaveBeenCalled();
        flush();
    }));

    it('when user select apple login option and if it return error then it should display the error', fakeAsync(() => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        spyOn(service, 'appleLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
        spyOn(component, 'redirectTo').and.callFake(() => { });
        component.appleSignIn();
        expect(service.appleLogin).toHaveBeenCalled();
        tick(100);
        expect(spyMessage).toHaveBeenCalledWith('error', { message: 'something went wrong please try again' });
    }));


    it('on call redirectTo it should redirect to dashboard if category and tag set', () => {
        user = testData.userList[0];
        const navigate = spyOn(component.routerExtension, 'navigate');
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.redirectTo();
        expect(navigate).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });

    it('on call navigateTo it should show message and redirect to dashboard when mode = 0', () => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        const navigate = spyOn(component.routerExtension, 'navigate');
        component.navigateTo('dashboard', 0);
        expect(spyMessage).toHaveBeenCalledWith('success', 'You have been successfully logged in');
        expect(navigate).toHaveBeenCalledWith(['dashboard'], { clearHistory: true });
    });

    it('on call navigateTo it should show message and redirect to dashboard when mode = 1', () => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        const navigate = spyOn(component.routerExtension, 'navigate');
        component.navigateTo('dashboard', 1);
        expect(spyMessage).toHaveBeenCalledWith('success', 'You have been successfully signed up');
        expect(navigate).toHaveBeenCalledWith(['dashboard'], { clearHistory: true });
    });

    it('on call showMessage it should set message ', () => {

        component.showMessage('success', 'You have been successfully signed up');
        expect(component.message).toEqual({
            show: true,
            type: 'success',
            text: 'You have been successfully signed up'
        });
    });

    it('on call changeMode if mode is dashboard then it should redirect to dashboard page ', () => {
        const navigate = spyOn(component.routerExtension, 'navigate');
        component.changeMode('/dashboard');
        expect(navigate).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });


    it('on call changeMode if mode is email then it should set signInMethod and should call removeMessage ', () => {
        const spyOnRemoveMessage = spyOn(component, 'removeMessage');
        component.changeMode('email');
        expect(component.signInMethod).toBe('email');
        expect(spyOnRemoveMessage).toHaveBeenCalled();
    });

    it('on call changeMode if mode is 1 then it should call removeMessage ', () => {
        const spyOnRemoveMessage = spyOn(component, 'removeMessage');
        component.changeMode(1);
        expect(spyOnRemoveMessage).toHaveBeenCalled();
    });

    it('on call removeMessage it should set reset message ', () => {

        component.removeMessage();
        expect(component.message).toEqual({
            show: false,
            type: '',
            text: ''
        });
    });

    it('on call navigateTo it should show message and redirect to dashboard when mode = 0', () => {
        const services = TestBed.get(Utils);
        const spyHideKeyboard = spyOn(services, 'hideKeyboard');
        component.hideKeyboard();
        expect(spyHideKeyboard).toHaveBeenCalled();
    });

    it(`call to change Mode it should change title should be 'Login'`, () => {
        component.changeMode(0);
        expect(component.loginForm.get('mode').value).toBe(0);
        expect(component.title).toBe('Login');
    });

    it(`call to change Mode it should change title should be 'Get a bit wiser - Sign up'`, () => {
        component.changeMode(1);
        expect(component.loginForm.get('mode').value).toBe(1);
        expect(component.title).toBe('Get a bit wiser - Sign up');
    });

    it(`call to change Mode it should change title should be 'Forgot Password'`, () => {
        component.changeMode(2);
        expect(component.loginForm.get('mode').value).toBe(2);
        expect(component.title).toBe('Forgot Password');
    });

    it('on call navigateTo it should show message and redirect to dashboard when mode = 0', () => {
        const services = TestBed.get(PhoneNumberValidationProvider);
        const spyIsValidMobile = spyOn(services, 'isValidMobile');
        component.validateNumber();
        expect(spyIsValidMobile).toHaveBeenCalled();
    });

    it('when user select phoneLogin login option then if selectedCountry is empty then set isCountryCodeError is true', fakeAsync(() => {
        spyOn(service, 'phoneLogin');
        spyOn(component, 'redirectTo').and.callFake(() => { });
        spyOn(component, 'validateNumber').and.callFake(() => true);
        component.input.selectedCountry = '';
        component.changeMode('phone');
        component.signInMethod = 'phone';
        component.signInWithPhone();
        expect(component.isCountryCodeError).toBeTruthy();
        flush();
    }));

    it('when user select phoneLogin login option then it should call phoneLogin login function to login user', fakeAsync(() => {
        spyOn(service, 'phoneLogin');
        spyOn(component, 'redirectTo').and.callFake(() => { });
        spyOn(component, 'validateNumber').and.callFake(() => true);
        component.changeMode('phone');
        component.signInMethod = 'phone';
        component.signInWithPhone();
        expect(service.phoneLogin).toHaveBeenCalled();
        flush();
    }));

    it('when user select phoneLogin login option and if it return error then it should display the error', fakeAsync(() => {
        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        spyOn(service, 'phoneLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
        spyOn(component, 'redirectTo').and.callFake(() => { });
        spyOn(component, 'validateNumber').and.callFake(() => true);
        component.changeMode('phone');
        component.signInMethod = 'phone';
        component.signInWithPhone();
        expect(service.phoneLogin).toHaveBeenCalled();
        tick(100);
        expect(spyMessage).toHaveBeenCalledWith('error', { message: 'something went wrong please try again' });
        flush();
    }));

    it('on call onSelectCountry it should set selected country code and set isCountryCodeError false', fakeAsync(async () => {
        const services = TestBed.get(ModalDialogService);
        const response = {
            flagClass: 'ec',
            name: 'Ecuador',
            dialCode: '593',
        };

        const spyOpenDialog = spyOn(services, 'showModal').and.returnValue(Promise.resolve(response));
        component.onSelectCountry();
        await spyOpenDialog.calls.mostRecent().returnValue;
        expect(component.input).toEqual({
            'selectedCountry': 'Ecuador',
            'countryCode': '+593',
            'phoneNumber': '',
            'country': 'ec'
        });
        expect(component.isCountryCodeError).toBeFalsy();
        expect(component.isCountryListOpened).toBeFalsy();
        flush();
    }));

    it('on call onSelectCountry if country is not selected then it should show error', fakeAsync(async () => {
        const services = TestBed.get(ModalDialogService);
        const spyOpenDialog = spyOn(services, 'showModal').and.returnValue(Promise.resolve(undefined));
        component.input.selectedCountry = null;
        component.onSelectCountry();
        await spyOpenDialog.calls.mostRecent().returnValue;
        expect(component.isCountryCodeError).toBeTruthy();
        expect(component.isCountryListOpened).toBeFalsy();
        flush();
    }));

    it('When user fill signup form and password and confirm password fields are not same then is should set error', () => {
        const email = 'demo@demo.com';
        const password = 'demodemo';
        component.changeMode(1);
        component.setValidatorForSingUp();
        component.loginForm.get('email').setValue(email);
        component.loginForm.get('password').setValue(password);
        component.loginForm.get('confirmPassword').setValue('password');
        expect(component.loginForm.hasError('passwordmismatch')).toBeTruthy();
    });

    // tslint:disable-next-line: max-line-length
    it('When user fill signup form and it has not inserted any value to email, password and confirm password then it should show error for required fields', () => {
        component.changeMode(1);
        component.setValidatorForSingUp();
        component.loginForm.get('email').setValue('');
        component.loginForm.get('password').setValue('');
        component.loginForm.get('confirmPassword').setValue('');
        expect(component.loginForm.get('email').errors).toEqual({ 'required': true });
        expect(component.loginForm.get('password').errors).toEqual({ 'required': true });
        expect(component.loginForm.get('confirmPassword').errors).toEqual({ 'required': true });
    });

    it('When user fill signup form and enter invalid email then it should show error', () => {
        const email = 'test';
        component.changeMode(1);
        component.setValidatorForSingUp();
        component.loginForm.get('email').setValue(email);
        expect(component.loginForm.get('email').errors).toEqual({
            'pattern': {
                // tslint:disable-next-line: max-line-length
                'actualValue': 'test', 'requiredPattern': '/^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'
            }
        });
    });

    // tslint:disable-next-line: max-line-length
    it('When user fill login form and it has not inserted any value to email, password then it should show error for required fields and confirm password should not required', () => {
        component.changeMode(0);
        component.setValidatorForLogin();
        component.loginForm.get('email').setValue('');
        component.loginForm.get('password').setValue('');
        component.loginForm.get('confirmPassword').setValue('');
        expect(component.loginForm.get('email').errors).toEqual({ 'required': true });
        expect(component.loginForm.get('password').errors).toEqual({ 'required': true });
        expect(component.loginForm.get('confirmPassword').errors).toEqual(null);
    });


    // tslint:disable-next-line: max-line-length
    it('When user fill forgot password form and it has not inserted any value to email then it should show error for required fields. password and confirm password should not required', () => {
        component.changeMode(3);
        component.setValidatorForForgotPassword();
        component.loginForm.get('email').setValue('');
        component.loginForm.get('password').setValue('');
        component.loginForm.get('confirmPassword').setValue('');
        expect(component.loginForm.get('email').errors).toEqual({ 'required': true });
        expect(component.loginForm.get('password').errors).toEqual(null);
        expect(component.loginForm.get('confirmPassword').errors).toEqual(null);
    });


});
