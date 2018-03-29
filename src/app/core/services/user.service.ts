import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { User } from '../../model';
import * as useractions from '../../user/store/actions';



@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>) {
    }


    getUserRoles(user: User): Observable<User> {
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

    saveUserProfile(user: User) {
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        this.db.doc(`/users/${dbUser.userId}`).set(dbUser).then(ref => {
            // this.store.dispatch(this.userActions.addUserProfileSuccess());
            this.store.dispatch(new useractions.AddUserProfileSuccess());
        });
    }


    getUserProfile(user: User): Observable<User> {
        return this.db.doc<any>(`/users/${user.userId}`)
            .valueChanges()
            .map(u => {
                if (u) {
                    user = { ...user, ...u }
                }
                return user;
            })
            .mergeMap(u => this.getUserProfileImage(u));
    }

    getUserProfileImage(user: User): Observable<User> {
        if (user.profilePicture !== undefined) {
            const filePath = `profile/${user.userId}/avatar/${user.profilePicture}`;
            const ref = this.storage.ref(filePath);
            return ref.getDownloadURL().map(url => {
                user.profilePictureUrl = (url) ? url : '/assets/images/yourimg.png';
                return user;
            });
        } else {
            user.profilePictureUrl = '/assets/images/yourimg.png'
            return Observable.of(user);
        }
    }

    setSubscriptionFlag(userId: string) {
        this.db.doc(`/users/${userId}`).update({ isSubscribed: true });
    }

}
