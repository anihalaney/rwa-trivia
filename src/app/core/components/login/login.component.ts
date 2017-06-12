import { Component, Input } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AppStore } from '../../store/app-store';
import { PasswordAuthComponent } from './password-auth.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private afAuth: AngularFireAuth,
              private dialog: MdDialog,
              private passwordAuthDialogRef: MdDialogRef<PasswordAuthComponent>) {

  }

  googleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  fbLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  twitterLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  githubLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  passwordLogin() {
    this.passwordAuthDialogRef = this.dialog.open(PasswordAuthComponent, {
      disableClose: false,
      width: "600px",
      height: "400px"
    });
  }
}
