import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
import * as firebaseApp from 'nativescript-plugin-firebase/app';
import * as firebase from 'nativescript-plugin-firebase';
import { Subject, Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';


@Injectable()
export class TNSFirebaseAuthService implements FirebaseAuthService {

    private userSubject: Subject<firebase.User>;
    constructor(private routerExtension: RouterExtensions) {
        this.userSubject = new Subject<firebase.User>();
        firebase.addAuthStateListener({
            onAuthStateChanged: (data) => this.userSubject.next(data.user),
        });
    }

    public createUserWithEmailAndPassword(email, password) {
        return firebaseApp.auth().createUserWithEmailAndPassword(email, password);
    }

    public showLogin() {
        this.routerExtension.navigate(['/login'], { clearHistory: true });
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

    public googleLogin(): Promise<any> {
        return firebase.login({ type: firebase.LoginType.GOOGLE });
    }

    public facebookLogin(): Promise<any> {
        return firebase.login({
            type: firebase.LoginType.FACEBOOK,
            facebookOptions: {
                scope: ['public_profile', 'email']
            }
        });
    }

    public twitterLogin(): Promise<any> { return new Promise(resolve => resolve()); }

    public githubLogin(): Promise<any> { return new Promise(resolve => resolve()); }

    public resumeState(user) {
        this.userSubject.next(user);
    }
}
