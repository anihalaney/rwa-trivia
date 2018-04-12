import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { User, Invitations, Friends } from '../../model';
import * as useractions from '../../user/store/actions';
import { ObservableInput } from 'rxjs/Observable';



@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>) {
    }


    loadUserProfile(user: User): Observable<User> {
        return this.db.doc<any>('/users/' + user.userId).valueChanges()
            .map(u => {
                if (u) {
                    user = { ...user, ...u }
                }
                return user;
            })
            .mergeMap(u => this.getUserProfileImage(u));
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


    getUserProfileImage(user: User): Observable<User> {
        if (user.profilePicture && user.profilePicture !== '') {
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

    saveUserInvitations(obj: any) {
        const invitation = new Invitations();
        invitation.created_uid = obj.created_uid;
        invitation.status = obj.status;

        obj.emails.map((element) => {
            invitation.email = element;
            const dbInvitation = Object.assign({}, invitation); // object to be saved
            const id = this.db.createId();
            dbInvitation.id = id;
            this.db.doc('/invitations/' + dbInvitation.id).set(dbInvitation).then(ref => {
                this.store.dispatch(new useractions.AddUserInvitationSuccess());
            });
        });

    }

    checkInvitationToken(obj: any) {
        return this.db.doc(`/invitations/${obj.token}`)
            .snapshotChanges().take(1)
            .map(invitation => {
                if (invitation.payload.exists && invitation.payload.data().email === obj.email) {
                    return this.db.doc(`/friends/${obj.userId}`)
                        .snapshotChanges().take(1)
                        .map(friend => {
                            if (friend.payload.exists) {
                            } else {
                                const friends = new Friends();
                                friends.myFriend.push(invitation.payload.data().created_uid);
                                const dbUser = Object.assign({}, friends);
                                this.db.doc(`/friends/${obj.userId}`).set(dbUser).then(ref => {
                                });
                            }

                        })
                } else {
                    return null;
                }
            });
    }

    makeFriend(data: any): Observable<any> {

        return null;
    }

}
