
import { Injectable } from '@angular/core';
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
export class UserService {
  constructor(private store: Store<AppStore>,
              private userActions: UserActions,
              private uiStateActions: UIStateActions,
              public afAuth: AngularFireAuth,
              private db: AngularFirestore,
              public dialog: MatDialog) {}


 saveUser(user:User){
   let dbUser = Object.assign({},user);
   user.authState = null;
   this.db.doc('/users/'+user.userId).set(dbUser).then(ref => {
     console.log('User Saved');
   });
 }

  getUser(): Observable<User[]> {
    return this.db.collection<User>('/users').valueChanges().take(1);
  }
}
