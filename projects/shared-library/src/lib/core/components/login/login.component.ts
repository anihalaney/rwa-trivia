import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CoreState, UIStateActions } from '../../store';
import { Store } from '@ngrx/store';
import { Utils } from '../../services';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { Login } from './login';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Login implements OnInit, OnDestroy {
  
  constructor(public fb: FormBuilder,
    public store: Store<CoreState>,
    public dialogRef: MatDialogRef<LoginComponent>,
    private uiStateActions: UIStateActions,
    private utils: Utils,
    private firebaseAuthService: FirebaseAuthService) {
    super(fb, store);
  }

  ngOnInit() { }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    switch (this.mode) {
      case 0:
        // Login
        this.firebaseAuthService.signInWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          // Success
          this.dialogRef.close();
        }, (error: Error) => {
          // Error
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        });
        break;
      case 1:
        // Sign up
        this.firebaseAuthService.createUserWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          // Success
          this.dialogRef.close();
          if (user && !user.emailVerified) {
            this.firebaseAuthService.sendEmailVerification(user).then(() => {
              this.notificationMsg = `email verification sent to ${this.loginForm.get('email').value}`;
              this.errorStatus = false;
            }, (error: Error) => {
              // Error
              this.notificationMsg = error.message;
              this.errorStatus = true;
            });
          }
        }, (error: Error) => {
          // Error
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        });
        break;
      case 2:
        // Forgot Password
        this.firebaseAuthService.sendPasswordResetEmail(this.loginForm.get('email').value)
          .then((a: any) => {
            this.notificationMsg = `email sent to ${this.loginForm.get('email').value}`;
            this.errorStatus = false;
            this.notificationLogs.push(this.loginForm.get('email').value);
            this.store.dispatch(this.uiStateActions.saveResetPasswordNotificationLogs(this.notificationLogs));
          }, (error: Error) => {
            // Error
            this.notificationMsg = error.message;
            this.errorStatus = true;
          }).catch((error: Error) => {
            this.notificationMsg = error.message;
            this.errorStatus = true;
          });
    }
  }

  googleLogin() {
    this.firebaseAuthService.googleLogin().catch((error: Error) => {
      this.notificationMsg = error.message;
      this.errorStatus = true;
    });
  }

  fbLogin() {
    this.firebaseAuthService.facebookLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  twitterLogin() {
    this.firebaseAuthService.twitterLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  githubLogin() {
    this.firebaseAuthService.githubLogin()
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  validateLogs() {
    if (this.notificationLogs.indexOf(this.loginForm.get('email').value) !== -1) {
      this.notificationMsg = `Password is sent on your email ${this.loginForm.get('email').value}`;
      return true;
    }
    this.notificationMsg = '';
    return false;
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}

