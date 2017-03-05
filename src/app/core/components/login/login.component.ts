import { Component, Input } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { AppStore } from '../../store/app-store';
import { PasswordAuthComponent } from './password-auth.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private store: Store<AppStore>,
              private af: AngularFire,
              private dialog: MdDialog,
              private passwordAuthDialogRef: MdDialogRef<PasswordAuthComponent>,
              public dialogRef: MdDialogRef<LoginComponent>) {

  }

  googleLogin() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  fbLogin() {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  twitterLogin() {
    this.af.auth.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Popup
    });
  }

  githubLogin() {
    this.af.auth.login({
      provider: AuthProviders.Github,
      method: AuthMethods.Popup
    });
  }

  passwordLogin() {
    this.passwordAuthDialogRef = this.dialog.open(PasswordAuthComponent, {
      disableClose: false,
      width: "600px",
      height: "400px"
    });
  }
}
