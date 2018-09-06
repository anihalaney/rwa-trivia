import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { CoreState } from '../store';
import { User, Invitation, Friends } from '../../shared/model';
import { ObservableInput } from 'rxjs';
import { CONFIG } from '../../environments/environment';
import { UserActions } from '../../core/store/actions';
const firebase = require("nativescript-plugin-firebase/app");
const firebaseWebApi = require("nativescript-plugin-firebase/app");



@Injectable()
export class UserService {

    constructor(
        private http: HttpClient,
        private store: Store<CoreState>, private userActions: UserActions) {
    }


    loadUserProfile(user: User): Observable<User> {

        const userCollection = firebase.firestore().collection("users");
        // console.log('user called', user);
        const dbUser = Object.assign({}, user);
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        userCollection.doc(user.userId).set(user);
        let res = firebase.firestore().collection("users").doc(`${user.userId}`);

        return res.get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                return new Observable();
            }
        });

    }

    saveUserProfile(user: User): Observable<any> {
        const url = `${CONFIG.functionsUrl}/app/user/profile`;
        user.roles = (!user.roles) ? {} : user.roles;
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        return this.http.post<User>(url, { user: dbUser });

    }


    loadOtherUserProfile(userId: string): Observable<User> {
        const url = `${CONFIG.functionsUrl}/app/user/${userId}`;
        return this.http.get<User>(url);
    }


    getUserProfileImage(user: User): Observable<User> {
        // if (user.profilePicture && user.profilePicture !== '') {
        //     const filePath = `profile/${user.userId}/avatar/${user.profilePicture}`;
        //     const ref = this.storage.ref(filePath);
        //     return ref.getDownloadURL().pipe(map(url => {
        //         user.profilePictureUrl = (url) ? url : '/assets/images/default-avatar-small.png';
        //         return user;
        //     }));
        // } else {
        //     user.profilePictureUrl = '/assets/images/default-avatar-small.png'
        //     return of(user);
        // }

        return of();
    }

    setSubscriptionFlag(userId: string) {
        // this.db.doc(`/users/${userId}`).update({ isSubscribed: true });
        return of();
    }

    saveUserInvitations(obj: any): Observable<boolean> {
        // const invitation = new Invitation();
        // invitation.created_uid = obj.created_uid;
        // invitation.status = obj.status;
        // const email = this.db.firestore.batch();
        // obj.emails.map((element) => {
        //     invitation.email = element;
        //     const dbInvitation = Object.assign({}, invitation); // object to be saved
        //     const id = this.db.createId();
        //     dbInvitation.id = id;
        //     email.set(this.db.firestore.collection('invitations').doc(dbInvitation.id), dbInvitation);
        // });
        // email.commit();
        // return of(true);
        return of(true);
    }

    checkInvitationToken(obj: any): Observable<any> {
        const url = `${CONFIG.functionsUrl}/app/friend`;
        return this.http.post<any>(url, obj);
    }

    loadUserFriends(userId: string): Observable<Friends> {
        // return this.db.doc<Friends>(`/friends/${userId}`).valueChanges();
        return of();
    }
}
