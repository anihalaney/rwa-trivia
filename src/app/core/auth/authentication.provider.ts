import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { AppState, appState } from '../../store';
import { LoginComponent } from '../components';
import { UserActions, UIStateActions } from '../store/actions';
import { User } from '../../model';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthenticationProvider {
  dialogRef: MatDialogRef<LoginComponent>;
  refreshTokenObserver: Observable<any>;
  user: User;

  constructor(private store: Store<AppState>,
    private userActions: UserActions,
    private uiStateActions: UIStateActions,
    public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    public dialog: MatDialog) {


    this.afAuth.authState.subscribe(afUser => {
      if (afUser) {
        afUser.getIdToken(false).then((token) => {
          this.user = new User(afUser)
          this.user.idToken = token;
          this.store.dispatch(this.userActions.loginSuccess(this.user));

        });
      } else {
        // user not logged in
        this.store.dispatch(this.userActions.logoff());
      }
    });

    this.refreshTokenObserver = Observable.defer(() => {
      return Observable.fromPromise(this.generateToken(true));
    }).share();
  }

  ensureLogin = function (url?: string) {
    if (!this.isAuthenticated) {
      this.showLogin(url);
    }
  };

  generateToken = function (flag) {
    return firebase.auth().currentUser.getIdToken(flag).then((token) => {
      return token;
    });

  }


  refreshToken = function () {
    return this.refreshTokenObserver.do((tokenResponse) => {
      this.user.idToken = tokenResponse;
      this.store.dispatch(this.userActions.loginSuccess(this.user));
      return tokenResponse;
    },
      (err) => {
        return Observable.throw(err);
      });
  }


  showLogin = function (url?: string) {
    this.store.dispatch(this.uiStateActions.setLoginRedirectUrl(url));
    this.dialogRef = this.dialog.open(LoginComponent, {
      disableClose: false
    });
  };

  logout = function () {
    this.afAuth.auth.signOut();
  };

  get isAuthenticated(): boolean {
    let user: User;
    this.store.select(appState.coreState).take(1).subscribe(s => user = s.user)
    if (user) {
      return true;
    }
    return false;
  };
}
