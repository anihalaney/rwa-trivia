import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

import { AppStore } from '../../store/app-store';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private store: Store<AppStore>,
              private af: AngularFire,
              public dialogRef: MdDialogRef<LoginComponent>) {

  }

  googleLogin() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

}
