import { Injectable }    from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AngularFire } from 'angularfire2';
import { Store } from '@ngrx/store';
import '../rxjs-extensions';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../components/login/login.component';
import { UserActions } from '../store/actions';
import { User } from '../model';


@Injectable()
export class AuthenticationService {
  constructor(private store: Store<AppStore>,
              private userActions: UserActions,
              public af: AngularFire,
              public dialog: MdDialog) {

  this.af.auth.subscribe(user => {
      if(user) {
        // user logged in
        console.log(user);
        console.log(user.auth.providerData[0].displayName + ":" + user.auth.providerData[0].email);
        this.store.dispatch(this.userActions.loginSuccess(new User(user)));
      }
      else {
        // user not logged in
        this.store.dispatch(this.userActions.logoff());
      }
    });
  }

  ensureLogin = function() {
    if (!this.isAuthenticated)
      this.showLogin();
  };

  showLogin = function() {
    this.dialogRef = this.dialog.open(LoginComponent, {
      disableClose: false
    });
  };

  logout = function() {
    this.af.auth.logout();    
  };

  get isAuthenticated () : boolean {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user)
    if (user)
      return true;

    return false;
  };

  get user () : User {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user)
    return user;
  };

}
