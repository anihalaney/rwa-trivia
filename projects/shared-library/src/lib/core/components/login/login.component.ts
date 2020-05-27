import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CoreState, UIStateActions } from '../../store';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { Login } from './login';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { WindowRef } from 'shared-library/core/services';
import { CONFIG } from 'shared-library/environments/environment';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class LoginComponent extends Login implements OnDestroy {
  ui: any;
  uiConfig: any;

  constructor(public fb: FormBuilder,
    public store: Store<CoreState>,
    public dialogRef: MatDialogRef<LoginComponent>,
    private uiStateActions: UIStateActions,
    private firebaseAuthService: FirebaseAuthService,
    public cd: ChangeDetectorRef,
    private windowsRef: WindowRef) {
    super(fb, store, cd);

    this.uiConfig = {
      callbacks: {
        // used this function to return false for do not redirect after success
        signInSuccessWithAuthResult: (authResult, redirectUrl) => false
      },
      autoUpgradeAnonymousUsers: false,
      signInOptions: [
        firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
      tosUrl: CONFIG.termsAndConditionsUrl,
      privacyPolicyUrl: () => windowsRef.nativeWindow.open(CONFIG.privacyUrl, '_blank')
    };
  }

  phoneSignIn() {
    this.setPhoneSignIn();
    if (!this.ui) {
      this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    this.ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  emailSignIn() {
    if (this.ui && this.signInMethod === 'phone') {
      this.ui.reset();
    }
    this.setEmailSignIn();
  }
  async onSubmit() {
    let user;
    if (!this.loginForm.valid) {
      return;
    }
    try {
      switch (this.mode) {
        case 0:
          // Login
          user = await this.firebaseAuthService.signInWithEmailAndPassword(
            this.loginForm.get('email').value,
            this.loginForm.get('password').value
          );
          if (user) {
            this.dialogRef.close();
          }
          break;
        case 1:
          // Sign up
          user = await this.firebaseAuthService.createUserWithEmailAndPassword(
            this.loginForm.get('email').value,
            this.loginForm.get('password').value
          );
          if (user) {
            this.dialogRef.close();
            if (user && !user.emailVerified) {
              const verifyUser = await this.firebaseAuthService.sendEmailVerification(user);
              if (verifyUser) {
                this.notificationMsg = `email verification sent to ${this.loginForm.get('email').value}`;
                this.errorStatus = false;
              }
            }
          }
          break;
        case 2:
          // Forgot Password
          const isEmailSent = await this.firebaseAuthService.sendPasswordResetEmail(this.loginForm.get('email').value);
          if (isEmailSent) {
            this.notificationMsg = `email sent to ${this.loginForm.get('email').value}`;
            this.errorStatus = false;
            this.notificationLogs.push(this.loginForm.get('email').value);
            this.store.dispatch(this.uiStateActions.saveResetPasswordNotificationLogs(this.notificationLogs));
          }
      }

    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.markForCheck();
    } finally {
      this.cd.markForCheck();
    }
  }

  async googleLogin() {
    try {
      await this.firebaseAuthService.googleLogin();
    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    }
  }

  async fbLogin() {
    try {
      await this.firebaseAuthService.facebookLogin();
    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    }
  }

  async appleSignIn() {
    try {
      await this.firebaseAuthService.appleLogin();
    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    }
  }

  async twitterLogin() {
    try {
      await this.firebaseAuthService.twitterLogin();
    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    }
  }

  async githubLogin() {
    try {
      await this.firebaseAuthService.githubLogin();
    } catch (error) {
      this.notificationMsg = error.message;
      this.errorStatus = true;
      this.cd.detectChanges();
    }
  }

  validateLogs() {
    if (this.notificationLogs.indexOf(this.loginForm.get('email').value) !== -1) {
      this.notificationMsg = `Password is sent on your email ${this.loginForm.get('email').value}`;
      return true;
    }
    if (!this.errorStatus) {
      this.notificationMsg = '';
    }
    return false;
  }

  ngOnDestroy() {

  }

}

