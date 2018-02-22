import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { UserActions } from '../store/actions';
import { User } from '../../model';

@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppStore>,
        private userActions: UserActions,
        private http: HttpClient) {
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

    saveUserProfileData(user: User) {
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser['authState'];
        this.db.doc('/users/' + dbUser.userId).set(dbUser).then(ref => {
            this.store.dispatch(this.userActions.addUserProfileDataSuccess());
        });
    }

    // get user by Id
    getUserById(user: User): Observable<User> {
        return this.db.collection('/users', ref => ref.where('userId', '==', user.userId))
            .valueChanges()
            .catch(error => {
                console.log(error);
                return Observable.of(null);
            });
    }
}
