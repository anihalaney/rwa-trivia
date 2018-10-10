import { Injectable, NgZone } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
const firebaseApp = require("nativescript-plugin-firebase/app");
const firebase = require("nativescript-plugin-firebase");
import { of, Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class TNSFirebaseAuthService extends FirebaseAuthService {
    private userSubject: Subject<firebase.User>;
    constructor(private zone: NgZone) {
        super();
        this.userSubject = new Subject<firebase.User>();
        firebase.addAuthStateListener({
            onAuthStateChanged: (data) => this.userSubject.next(data.user),
        });
    }

    public createUserWithEmailAndPassword(email, password) {

    }

    public authState(): any {
        return this.userSubject.asObservable();
    }

    public getIdToken(user, forceRefresh: boolean) {

        return firebase.getAuthToken({
            // default false, not recommended to set to true by Firebase but exposed for {N} devs nonetheless :)
            forceRefresh: forceRefresh
        });
    }

    public refreshToken(forceRefresh: boolean) {
        return firebase.getAuthToken({
            // default false, not recommended to set to true by Firebase but exposed for {N} devs nonetheless :)
            forceRefresh: forceRefresh
        });
    }

    public signOut(){
        firebaseApp.auth().signOut()
    }

}