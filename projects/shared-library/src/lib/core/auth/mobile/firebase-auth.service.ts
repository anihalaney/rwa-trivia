import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
import * as firebaseApp from 'nativescript-plugin-firebase/app';
import * as firebase from 'nativescript-plugin-firebase';
import { Subject, Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular/router';
import { User, CollectionConstants, UserStatusConstants, TriggerConstants } from 'shared-library/shared/model';
import { isAndroid } from 'tns-core-modules/ui/page/page';


@Injectable()
export class TNSFirebaseAuthService implements FirebaseAuthService {

    private userSubject: Subject<firebase.User>;
    private pushToken: string;
    private user: any;

    constructor(private routerExtension: RouterExtensions) {
        this.userSubject = new Subject<firebase.User>();
        firebase.addAuthStateListener({
            onAuthStateChanged: (data) => {
                this.user = data.user;
                return this.userSubject.next(data.user);
            }
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
        this.updateTokenStatus(this.user.uid, UserStatusConstants.OFFLINE);
        this.updatePushToken(undefined);
        firebaseApp.auth().signOut();
    }

    public firebaseAuth() {
        return firebaseApp.auth();
    }

    public async refreshToken(forceRefresh: boolean): Promise<string> {
        const token = await firebase.getAuthToken({
            forceRefresh: forceRefresh
        });
        return token.token;
    }

    public signInWithEmailAndPassword(email: string, password: string) {
        return firebaseApp.auth().signInWithEmailAndPassword(email, password);
    }

    public sendEmailVerification(user) {
        return firebase.sendEmailVerification();
    }

    public sendPasswordResetEmail(email: string) {
        return firebase.sendPasswordResetEmail(email);
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

    public phoneLogin(phoneNumber): Promise<any> {
        return firebase.login({
            type: firebase.LoginType.PHONE,
            phoneOptions: {
                phoneNumber: phoneNumber,
                verificationPrompt: 'Enter received verification code'
            }
        });
    }

    public twitterLogin(): Promise<any> { return new Promise(resolve => resolve()); }

    public githubLogin(): Promise<any> { return new Promise(resolve => resolve()); }

    public resumeState(user) {
        this.userSubject.next(user);
    }

    public updatePushToken(token: string) {
        this.pushToken = token;
    }

    public updateOnConnect(user: User) {
        firebaseApp.database().ref(`${CollectionConstants.INFO}/${CollectionConstants.CONNECTED}`)
            .once('value')
            .then(connected => {
                console.log('connected', connected);
                const status = connected.key === UserStatusConstants.CONNECTED ? UserStatusConstants.ONLINE : UserStatusConstants.OFFLINE;
                this.updateOnDisconnect();
                this.updateTokenStatus(user.userId, status);
            });
    }

    private updateOnDisconnect() {
        firebaseApp.database().ref(`${CollectionConstants.USERS}/${this.pushToken}`)
            .onDisconnect()
            .update({ status: UserStatusConstants.OFFLINE });
    }

    public updateTokenStatus(userId: string, status: string) {
        firebaseApp.database().ref(`/${CollectionConstants.USERS}/${this.pushToken}`)
            .set({ status, userId, device: (isAndroid) ? TriggerConstants.ANDROID : TriggerConstants.IOS });
    }
}
