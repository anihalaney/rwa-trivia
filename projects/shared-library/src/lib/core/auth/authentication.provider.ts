import { Injectable, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable, defer, throwError, from } from 'rxjs';
import { share, take, tap } from 'rxjs/operators';
import { CoreState, coreState } from '../store';
import { User } from '../../shared/model';
import { LoginComponent } from '../components';
import { UserActions, UIStateActions } from '../store/actions';
import { isPlatformBrowser } from '@angular/common';
import * as firebase from 'firebase/app';
import { IfStmt } from '@angular/compiler';

@Injectable()
export class AuthenticationProvider {
  dialogRef: MatDialogRef<LoginComponent>;
  refreshTokenObserver: Observable<any>;
  user: User;

  constructor(private store: Store<CoreState>,
    private userActions: UserActions,
    private uiStateActions: UIStateActions,
    public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {


    this.afAuth.authState.subscribe(afUser => {
      if (afUser) {
        afUser.getIdToken(false).then((token) => {
          this.user = new User(afUser)
          this.user.idToken = token;
          this.store.dispatch(this.userActions.loginSuccess(this.user));
          (this.dialogRef) ? this.dialogRef.close() : '';
        });
      } else {
        // user not logged in
        this.store.dispatch(this.userActions.logoff());
      }
    });

    this.refreshTokenObserver = defer(() => {
      return from(this.generateToken(true));
    }).pipe(share());
  }

  ensureLogin = function (url?: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.isAuthenticated) {
        this.showLogin(url);
      }
    }

  };

  generateToken = function (flag) {
    return firebase.auth().currentUser.getIdToken(flag).then((token) => {
      return token;
    });

  }


  refreshToken = function (): Observable<any> {
    return this.refreshTokenObserver.pipe(tap((tokenResponse) => {
      this.user.idToken = tokenResponse;
      this.store.dispatch(this.userActions.loginSuccess(this.user));
      return tokenResponse;
    },
      (err) => {
        return throwError(err);
      }));
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
    this.store.select(coreState).pipe(take(1)).subscribe(s => user = s.user)
    if (user) {
      return true;
    }
    return false;
  };
}
