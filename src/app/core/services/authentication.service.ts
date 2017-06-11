import { Injectable }    from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../components';
import { UserActions, UIStateActions } from '../store/actions';
import { User } from '../../model';

@Injectable()
export class AuthenticationService {
  dialogRef: MdDialogRef<LoginComponent>;

  constructor(private store: Store<AppStore>,
              private userActions: UserActions,
              private uiStateActions: UIStateActions,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public dialog: MdDialog) {


  this.afAuth.authState.subscribe(afUser => {
      if(afUser) {
        // user logged in
        //console.log(afUser);
        let user = new User(afUser);
        afUser.getIdToken(false).then((token) => {
          //console.log(token);
          user.idToken = token;
          this.store.dispatch(this.userActions.loginSuccess(user));
        });
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
    return this.db.object('/users/' + user.userId + "/roles")
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
    this.afAuth.auth.signOut();
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
