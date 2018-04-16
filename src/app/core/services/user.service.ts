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
import { CONFIG } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class UserService {

    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>,
        private http: HttpClient) {
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

    saveUserInvitations(obj: any): Observable<boolean> {
        const invitation = new Invitations();
        invitation.created_uid = obj.created_uid;
        invitation.status = obj.status;
        const email = this.db.firestore.batch();
        obj.emails.map((element) => {
            invitation.email = element;
            const dbInvitation = Object.assign({}, invitation); // object to be saved
            const id = this.db.createId();
            dbInvitation.id = id;
            email.set(this.db.firestore.collection('invitations').doc(dbInvitation.id), dbInvitation);
        });
        email.commit();
        return Observable.of(true);
    }

    checkInvitationToken(obj: any): Observable<string> {
        return this.db.doc(`/invitations/${obj.token}`)
            .valueChanges().take(1)
            .map(invitation => {
                if (invitation['email'] === obj.email) {
                    const invitations = new Invitations();
                    invitations.created_uid = invitation['created_uid'];
                    return invitations;
                }
                return null;

            }).mergeMap(invitation => {
                if (invitation !== null) {
                    return this.checkMyFriend(invitation.created_uid, obj.userId);
                } else {
                    return Observable.of(null);
                }
            })
            .mergeMap(invitationUserId => {
                if (invitationUserId != null) {
                    return this.checkMyFriend(obj.userId, invitationUserId)
                } else {
                    return Observable.of(null);
                }
            });


    }

    checkMyFriend(invitedUserId: string, userId: string): Observable<string> {
        return this.db.doc(`/friends/${userId}`)
            .snapshotChanges().take(1)
            .map(friend => friend).mergeMap(u => this.makeMyFriend(u, invitedUserId, userId));


    }

    makeMyFriend(friend: any, invitationUserId: string, userId: string): Observable<string> {

        const url: string = CONFIG.functionsUrl + '/app/makeFrieds';
        const friends = new Friends();
        if (friend.payload.exists && friend.payload.data()) {
            friends.myFriends = friend.payload.data().makeFrieds;
        }
        const payload = { friend: friends, invitationUserId: invitationUserId, userId: userId };
        return this.http.post<string>(url, payload);

        // if (friend.payload.exists && friend.payload.data()) {
        //     const array = friend.payload.data().myFriend;
        //     if (array.indexOf(invitationUserId) === -1) {
        //         array.push(invitationUserId);
        //         this.db.doc(`/friends/${userId}`).update({ myFriend: array });
        //     }
        //     return Observable.of(invitationUserId);

        // } else {
        //     const friends = new Friends();
        //     friends.myFriend = [];
        //     friends.myFriend.push(invitationUserId);
        //     friends.created_uid = userId;
        //     const dbUser = Object.assign({}, friends);
        //     this.db.doc(`/friends/${userId}`).set(dbUser);
        //     return Observable.of(invitationUserId);
        // }

    }


}
