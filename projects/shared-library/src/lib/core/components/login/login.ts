import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CoreState, coreState } from '../../store';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ApplicationSettings } from 'shared-library/shared/model';
import { ChangeDetectorRef } from '@angular/core';
export class Login {
  mode: SignInMode;
  loginForm: FormGroup;
  notificationMsg: string;
  errorStatus: boolean;
  subscriptions: Subscription[] = [];
  notificationLogs: string[];
  signInMethod = 'email';
  applicationSettings: ApplicationSettings;
  // tslint:disable-next-line:max-line-length
  email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public fb: FormBuilder,
    public store: Store<CoreState>,
    public cd: ChangeDetectorRef) {

    this.mode = 0;  // default
    this.notificationMsg = '';
    this.errorStatus = false;

    this.loginForm = this.fb.group({
      mode: [0],
      tnc: [false],
      phone: [''],
      email: new FormControl('', { validators: [Validators.required, Validators.pattern(this.email_regexp)] }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
      confirmPassword: new FormControl('')
    }, { validator: loginFormValidator }
    );

    this.subscriptions.push(this.loginForm.get('mode').valueChanges.subscribe((mode: number) => {
      switch (mode) {
        case 1:
          // Sign up
          this.setValidatorForSingUp();
          break;
        // no break - fall thru
        case 0:
          // Login or Sign up
          this.setValidatorForLogin();
          break;
        default:
          // Forgot Password
          this.setValidatorForForgotPassword();

      }
      this.loginForm.get('password').updateValueAndValidity();
      this.notificationMsg = '';
      this.errorStatus = false;
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.resetPasswordLogs))
      .subscribe(notificationLogs => this.notificationLogs = notificationLogs));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
      this.cd.markForCheck();
    }));
  }


  setValidatorForLogin() {
    this.loginForm.get('confirmPassword').clearValidators();
    this.loginForm.get('tnc').clearValidators();
    this.loginForm.get('password').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
    this.loginForm.get('password').updateValueAndValidity();
    this.loginForm.get('confirmPassword').updateValueAndValidity();
  }


  setValidatorForSingUp() {
    this.loginForm.get('confirmPassword').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
    this.loginForm.get('confirmPassword').updateValueAndValidity();
    this.loginForm.get('tnc').setValidators(Validators.required);
    this.loginForm.get('tnc').updateValueAndValidity();
  }

  setValidatorForForgotPassword() {
    this.loginForm.get('password').clearValidators();
    this.loginForm.get('confirmPassword').clearValidators();
    this.loginForm.get('tnc').clearValidators();
    this.loginForm.get('confirmPassword').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
    this.loginForm.get('tnc').updateValueAndValidity();
  }

  setPhoneSignIn() {
    this.signInMethod = 'phone';
  }

  setEmailSignIn() {
    this.signInMethod = 'email';
  }

  changeMode(mode) {
    this.mode = mode;
    this.loginForm.patchValue({ mode: this.mode });
  }

}

export enum SignInMode {
  signIn,
  signUp,
  forgotPassword,
  verifyNumber
}

function loginFormValidator(fg: FormGroup): { [key: string]: boolean } {
  // TODO: check if email is already taken

  // Password match validation for Sign up only
  if (fg.get('mode').value === 1 && fg.get('password') && fg.get('confirmPassword')
    && fg.get('password').value && fg.get('confirmPassword').value
    && fg.get('password').value !== fg.get('confirmPassword').value) {
    return { 'passwordmismatch': true };
  }

  return null;
}
