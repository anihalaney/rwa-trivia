import { Injectable }    from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AngularFire } from 'angularfire2';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../components/login/login.component';
import { UserActions, UIStateActions } from '../store/actions';
import { User } from '../../model';


@Injectable()
export class AuthenticationService {
  dialogRef: MdDialogRef<LoginComponent>;

  constructor(private store: Store<AppStore>,
              private userActions: UserActions,
              private uiStateActions: UIStateActions,
              public af: AngularFire,
              public dialog: MdDialog) {

  this.af.auth.subscribe(user => {
      if(user) {
        // user logged in
        console.log(user);
        this.store.dispatch(this.userActions.loginSuccess(new User(user)));
        if (this.dialogRef)
          this.dialogRef.close();
      }
      else {
        // user not logged in
        this.store.dispatch(this.userActions.logoff());
      }
    });
  }

  getUserRoles(user: User): Observable<User> {
    return this.af.database.object('/users/' + user.userId + "/roles")
           .take(1)
           .map(roles => {
             user.roles = roles;
             return user;
            });
  }

  ensureLogin = function(url?: string) {
    if (!this.isAuthenticated)
      this.showLogin(url);
  };

  showLogin = function(url?: string) {
    this.store.dispatch(this.uiStateActions.setLoginRedirectUrl(url));
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
