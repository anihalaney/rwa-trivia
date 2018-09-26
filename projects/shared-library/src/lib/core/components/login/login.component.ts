import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  mode: SignInMode;
  loginForm: FormGroup;
  notificationMsg: string;
  errorStatus: boolean;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>) {
    this.mode = SignInMode.signIn;  //default
    this.notificationMsg = '';
    this.errorStatus = false;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      mode: [0],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['']
    }, { validator: loginFormValidator }
    );

    this.loginForm.get('mode').valueChanges.subscribe((mode: number) => {
      switch (mode) {
        case 1:
          //Signup
          this.loginForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(6)]);
        //no break - fall thru
        case 0:
          //Login or Signup
          this.loginForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
          break;
        default:
          //Forgot Password
          this.loginForm.get('password').clearValidators();
          this.loginForm.get('confirmPassword').clearValidators();
      }
      this.loginForm.get('password').updateValueAndValidity();
      this.notificationMsg = '';
      this.errorStatus = false;
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    switch (this.mode) {
      case 0:
        //Login
        this.afAuth.auth.signInWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          //success
          this.dialogRef.close();
        }, (error: Error) => {
          //error
          // console.log(error);
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        });
        break;
      case 1:
        //Signup
        this.afAuth.auth.createUserWithEmailAndPassword(
          this.loginForm.get('email').value,
          this.loginForm.get('password').value
        ).then((user: any) => {
          //success
          this.dialogRef.close();
          if (user && !user.emailVerified) {
            user.sendEmailVerification().then(function () {
              // console.log("email verification sent to user");
              this.notificationMsg = `email verification sent to ${this.loginForm.get('email').value}`;
              this.errorStatus = false;
            });
          }
        }, (error: Error) => {
          //error
          // console.log(error);
          this.notificationMsg = error.message;
          this.errorStatus = true;
        }).catch((error: Error) => {
          this.notificationMsg = error.message;
          this.errorStatus = true;
        });
        break;
      case 2:
        //Forgot Password
        firebase.auth().sendPasswordResetEmail(this.loginForm.get('email').value)
          .then((a: any) => {
            //  console.log("success. check your email");
            this.notificationMsg = `email sent to ${this.loginForm.get('email').value}`;
            this.errorStatus = false;
          }, (error: Error) => {
            //error
            // console.log(error);
            this.notificationMsg = error.message;
            this.errorStatus = true;
          }).catch((error: Error) => {
            this.notificationMsg = error.message;
            this.errorStatus = true;
          });
    }
  }

  googleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  fbLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  twitterLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }

  githubLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .catch((error: Error) => {
        this.notificationMsg = error.message;
        this.errorStatus = true;
      });
  }
}

export enum SignInMode {
  signIn,
  signUp,
  forgotPassword
}

function loginFormValidator(fg: FormGroup): { [key: string]: boolean } {
  //TODO: check if email is already taken

  //Password match validation for Signup only
  if (fg.get('mode').value == 1 && fg.get('password').value !== fg.get('confirmPassword').value) {
    return { 'passwordmismatch': true }
  }

  return null;
}
