import { Injectable }    from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../components';
import { UserActions, UIStateActions } from '../store/actions';
import { User } from '../../model';

@Injectable()
export class AuthenticationService {
  dialogRef: MatDialogRef<LoginComponent>;

  constructor(private store: Store<AppStore>,
              private userActions: UserActions,
              private uiStateActions: UIStateActions,
              public afAuth: AngularFireAuth,
              private db: AngularFirestore,
              public dialog: MatDialog) {


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
    //return this.db2.collection("/users", ref => ref.where()).doc<any>('/users/' + user.userId).valueChanges();
    return this.db.doc<any>('/users/' + user.userId).snapshotChanges()
              .take(1)
              .map(u => {
                if (u.payload.exists && u.payload.data().roles) {
                  user.roles = u.payload.data().roles;
                }
                return user;
              })
              .catch(error => {
                console.log(error);
                return Observable.of(user);
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

  get authorizationHeader(): string {
    return (this.user) ? 'Bearer ' + this.user.idToken : null;
  }

}
