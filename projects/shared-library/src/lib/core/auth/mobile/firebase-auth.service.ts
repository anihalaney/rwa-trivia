import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
import * as firebaseApp from 'nativescript-plugin-firebase/app';
import * as firebase from 'nativescript-plugin-firebase';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TNSFirebaseAuthService implements FirebaseAuthService {

    private userSubject: Subject<firebase.User>;
    constructor() {
        this.userSubject = new Subject<firebase.User>();
        firebase.addAuthStateListener({
            onAuthStateChanged: (data) => this.userSubject.next(data.user),
        });
    }

    public createUserWithEmailAndPassword(email, password) {
        return firebaseApp.auth().createUserWithEmailAndPassword(email, password);
    }

    public showLogin() {
        throw new Error('Not implemented');
    }

    public authState(): Observable<firebase.User> {
        return this.userSubject.asObservable();
    }

    public getIdToken(user, forceRefresh: boolean) {
        return firebase.getAuthToken({
            forceRefresh: forceRefresh
        });
    }

    public signOut() {
        firebaseApp.auth().signOut();
    }

    public firebaseAuth() {
        return firebaseApp.auth();
    }

    public refreshToken(forceRefresh: boolean): Promise<string> {
        return firebase.getAuthToken({
            forceRefresh: forceRefresh
        });
    }

    public signInWithEmailAndPassword(email: string, password: string) {
        return firebaseApp.auth().signInWithEmailAndPassword(email, password);
    }

    public sendEmailVerification(user) {
        return firebase.sendEmailVerification();
    }

    public sendPasswordResetEmail(email: string) {
        return firebase.resetPassword({ email: email });
    }

    public googleLogin() {
        return firebase.login({ type: firebase.LoginType.GOOGLE });
    }

    public facebookLogin() {
        return firebase.login({
            type: firebase.LoginType.FACEBOOK,
            facebookOptions: {
              scope: ['public_profile', 'email']
            }
          });
    }

    public twitterLogin() { }

    public githubLogin() { }
}
