import { LoginComponent } from './login.component';
import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CoreState, UIStateActions, coreState, ActionWithPayload } from '../../store';
import { Store, StoreModule, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { WindowRef } from '../../services';
import { AngularFireModule, FirebaseAppConfig, FirebaseApp } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { CONFIG } from 'shared-library/environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let spy: any;
  let mockStore: MockStore<CoreState>;
  let service;
  let app: FirebaseApp;
  let afAuth: AngularFireAuth;

  const dialogMock = {
    close: () => { }
  };

  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, StoreModule.forRoot({}), MatDialogModule],

      schemas: [NO_ERRORS_SCHEMA],
      // Set provider
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            },
          ]
        }),

        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: dialogMock },
        UIStateActions,
        {

          provide: FirebaseAuthService,
          useValue: {
            googleLogin() { },
            facebookLogin() { },
            appleLogin() { },
            twitterLogin() { },
            githubLogin() { },
            signInWithEmailAndPassword(email, password) { },
            createUserWithEmailAndPassword(email, password) { },
            sendEmailVerification(user) { },
            sendPasswordResetEmail(email) { }
          }
        }
        ,
        WindowRef
      ],
    });
  }));

  beforeEach(() => {

    // create component
    fixture = TestBed.createComponent(LoginComponent);
    // mock data
    mockStore = TestBed.get(Store);
    // firebaseAuthService = new FirebaseAuthService();
    spy = spyOn(mockStore, 'dispatch');
    // Re-create component
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(FirebaseAuthService);
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    fixture.detectChanges();
  });

  // It should create component
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('on load component it should set applicationSettings', () => {
    mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
    mockStore.refreshState();
    expect(component.applicationSettings).toStrictEqual(testData.applicationSettings);
  });


  it('when user select google login option then it should call google login function to login user', () => {
    spyOn(service, 'googleLogin');
    component.googleLogin();
    expect(service.googleLogin).toHaveBeenCalled();

  });

  it('when user select google login option and if it return error then it should display the error', fakeAsync(() => {
    spyOn(service, 'googleLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
    component.googleLogin();
    expect(service.googleLogin).toHaveBeenCalled();
    tick(100);
    expect(component.notificationMsg).toBe('something went wrong please try again');
    expect(component.errorStatus).toBeTruthy();
  }));


  it('when user select facebook login option then it should call facebook login function to login user', () => {
    spyOn(service, 'facebookLogin');
    component.fbLogin();
    expect(service.facebookLogin).toHaveBeenCalled();
  });

  it('when user select facebook login option and if it return error then it should display the error', fakeAsync(() => {
    spyOn(service, 'facebookLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
    component.fbLogin();
    expect(service.facebookLogin).toHaveBeenCalled();
    tick(100);
    expect(component.notificationMsg).toBe('something went wrong please try again');
    expect(component.errorStatus).toBeTruthy();
  }));

  it('when user select apple login option then it should call apple login function to login user', () => {
    spyOn(service, 'appleLogin');
    component.appleSignIn();
    expect(service.appleLogin).toHaveBeenCalled();
  });

  it('when user select apple login option and if it return error then it should display the error', fakeAsync(() => {
    spyOn(service, 'appleLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
    component.appleSignIn();
    expect(service.appleLogin).toHaveBeenCalled();
    tick(100);
    expect(component.notificationMsg).toBe('something went wrong please try again');
    expect(component.errorStatus).toBeTruthy();
  }));

  it('when user select twitter login option then it should call twitter login function to login user', () => {
    spyOn(service, 'twitterLogin');
    component.twitterLogin();
    expect(service.twitterLogin).toHaveBeenCalled();
  });

  it('when user select twitter login option and if it return error then it should display the error', fakeAsync(() => {
    spyOn(service, 'twitterLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
    component.twitterLogin();
    expect(service.twitterLogin).toHaveBeenCalled();
    tick(100);
    expect(component.notificationMsg).toBe('something went wrong please try again');
    expect(component.errorStatus).toBeTruthy();
  }));

  it('when user select github login option then it should call github login function to login user', () => {
    spyOn(service, 'githubLogin');
    component.githubLogin();
    expect(service.githubLogin).toHaveBeenCalled();

  });

  it('when user select github login option and if it return error then it should display the error', fakeAsync(() => {
    spyOn(service, 'githubLogin').and.returnValue(Promise.reject({ message: 'something went wrong please try again' }));
    component.githubLogin();
    expect(service.githubLogin).toHaveBeenCalled();
    tick(100);
    expect(component.notificationMsg).toBe('something went wrong please try again');
    expect(component.errorStatus).toBeTruthy();
  }));


  it('when user select email signup option it should reset ui and set email sign in as login option', () => {
    component.ui = {
      reset: () => {
      }
    };
    component.signInMethod = 'phone';
    spyOn(component, 'setEmailSignIn');
    component.emailSignIn();
    expect(component.setEmailSignIn).toHaveBeenCalled();
  });

  // TODO: Need to check how we can test phone SignIn
  // I have tried but got error: The current environment does not support the specified persistence type.
  // https://github.com/firebase/firebaseui-web/issues/636
  it('when user select phoneSignIn login option then it should call phoneSingIn login function to login user', () => {
    component.ui = '';
    spyOn(component, 'setPhoneSignIn');
    // component.phoneSignIn();
    // expect(component.setPhoneSignIn).toHaveBeenCalled();
  });


  // tslint:disable-next-line: max-line-length
  it('User submit details for login and form is not valid then it should return undefined', fakeAsync(() => {

    spyOn(service, 'signInWithEmailAndPassword').and.returnValue(Promise.resolve(testData.userList[0]));
    const spyDialogRef = spyOn(component.dialogRef, 'close').and.callThrough();
    component.mode = 0;
    component.setValidatorForLogin();
    component.loginForm.get('email').setValue('demo@demo.com');
    const response = component.onSubmit();
    response.then(res => {
      expect(res).toBeUndefined();
    });

  }));

  // tslint:disable-next-line: max-line-length
  it('User submit details for login then it should signInWithEmailAndPassword function to login into system and modal dialog should close ', fakeAsync(() => {

    spyOn(service, 'signInWithEmailAndPassword').and.returnValue(Promise.resolve(testData.userList[0]));
    const spyDialogRef = spyOn(component.dialogRef, 'close').and.callThrough();
    component.mode = 0;
    component.setValidatorForLogin();
    component.loginForm.get('email').setValue('demo@demo.com');
    component.loginForm.get('password').setValue('demodemo');
    component.onSubmit();
    tick(100);
    expect(service.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(spyDialogRef).toHaveBeenCalled();
  }));

  // tslint:disable-next-line: max-line-length
  it('User submit details for signup then it should createUserWithEmailAndPassword function to singup into system and modal dialog should close ', fakeAsync(() => {

    spyOn(service, 'createUserWithEmailAndPassword').and.returnValue(Promise.resolve(testData.userList[0]));
    spyOn(service, 'sendEmailVerification').and.returnValue(Promise.resolve(testData.userList[0]));
    const email = 'demo@demo.com';
    const password = 'demodemo';

    const spyDialogRef = spyOn(component.dialogRef, 'close').and.callThrough();
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
    expect(spyDialogRef).toHaveBeenCalled();
    expect(component.notificationMsg).toBe(`email verification sent to ${email}`);
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
    expect(component.notificationMsg).toBe(`email sent to ${email}`);
  }));


  it('User submit for forgot password if there is any error then it should set error message', fakeAsync(() => {

    const email = 'demo@demo.com';
    const payload = [email];

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
    expect(component.errorStatus).toBeTruthy();
    expect(component.notificationMsg).toBe(`Something goes wrong.`);
  }));


  // tslint:disable-next-line: max-line-length
  it('when user submit forgot password details and email id is not different then it should return true and clear notificationMsg', fakeAsync(() => {

    const email = 'demo@demo.com';
    component.loginForm.get('email').setValue(email);
    component.errorStatus = false;

    component.notificationLogs = [email];
    const isValid = component.validateLogs();
    expect(isValid).toBeTruthy();
    expect(component.notificationMsg).toBe(`Password is sent on your email ${email}`);
  }));


  // tslint:disable-next-line: max-line-length
  it('when user submit forgot password details and email id is different then it should return false and clear notificationMsg', fakeAsync(() => {

    const email = 'demo@demo.com';
    component.loginForm.get('email').setValue(email);
    component.errorStatus = false;
    component.notificationLogs = [];
    const isValid = component.validateLogs();
    expect(isValid).toBeFalsy();
    expect(component.notificationMsg).toBe('');
  }));

  it('call to setPhoneSignIn function it should set signin method phone', () => {
    component.setPhoneSignIn();
    expect(component.signInMethod).toBe('phone');
  });

  it('call to setEmailSignIn function it should set signin method email', () => {
    component.setEmailSignIn();
    expect(component.signInMethod).toBe('email');
  });
  it('call to changeMode function it should set mode which is pass in param and set validation for login from', () => {
    const spySetValidatorForLogin = spyOn(component, 'setValidatorForLogin');
    component.changeMode(0);
    expect(component.loginForm.get('mode').value).toBe(0);
    expect(component.mode).toBe(0);
    expect(spySetValidatorForLogin).toHaveBeenCalled();
  });

  it('call to changeMode function it should set mode which is pass in param and set validation sing up from', () => {
    const spySetValidatorForSingUp = spyOn(component, 'setValidatorForSingUp');
    component.changeMode(1);
    expect(component.loginForm.get('mode').value).toBe(1);
    expect(component.mode).toBe(1);
    expect(spySetValidatorForSingUp).toHaveBeenCalled();
  });

  it('call to changeMode function it should set mode which is pass in param and set validation forgot password form', () => {
    const spySetValidatorForForgotPassword = spyOn(component, 'setValidatorForForgotPassword');
    component.changeMode(3);
    expect(component.loginForm.get('mode').value).toBe(3);
    expect(component.mode).toBe(3);
    expect(spySetValidatorForForgotPassword).toHaveBeenCalled();
  });

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
