import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from './../../components/login/login.component';
import { WindowRef } from './../../services/windowref.service';
import { isPlatformBrowser } from '@angular/common';
import { User, UserStatusConstants, CollectionConstants, TriggerConstants } from 'shared-library/shared/model';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable()
export class WebFirebaseAuthService implements FirebaseAuthService {

    dialogRef: MatDialogRef<LoginComponent>;
    private user: User;

    constructor(protected afAuth: AngularFireAuth,
        public router: Router,
        protected afStore: AngularFirestore,
        public dialog: MatDialog,
        @Inject(PLATFORM_ID) private platformId: Object,
        private windowsRef: WindowRef,
        private db: AngularFireDatabase) { }

    authState(): any {
        return this.afAuth.authState;
    }

    public createUserWithEmailAndPassword(email, password) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    public getIdToken(user, forceRefresh: boolean) {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        return user.getIdToken(forceRefresh);
    }

    public refreshToken(forceRefresh: boolean) {
        return this.getFirebaseUser().getIdToken(forceRefresh);
    }

    public async updatePassword(email: string, currentPassword: string, newPassword: string): Promise<any> {
        try {
            const credentials = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
            await this.getFirebaseUser().reauthenticateWithCredential(credentials);
            await this.getFirebaseUser().updatePassword(newPassword);
            return 'success';
        } catch (error) {
            console.log('error---->', error);
            throw error;
        }
    }

    private getFirebaseUser() {
        return firebase.auth().currentUser;
    }

    public async signOut() {
        this.updateTokenStatus(this.user.userId, UserStatusConstants.OFFLINE);
        await this.afAuth.auth.signOut();
        this.router.navigate(['dashboard']);
        if (isPlatformBrowser(this.platformId)) {
             this.windowsRef.nativeWindow.location.reload();
        }
    }

    public showLogin() {
        this.dialogRef = this.dialog.open(LoginComponent, {
            disableClose: false
        });
    }

    public sendEmailVerification(user): Promise<any> {
        return firebase.auth().currentUser.sendEmailVerification();
    }

    public signInWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    public firebaseAuth() {
        return this.afAuth.auth;
    }

    public googleLogin(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    public facebookLogin(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }
    public phoneLogin(phoneNumber): Promise<any> {
        return;
    }

    public twitterLogin(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }

    public githubLogin(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
    }

    public appleLogin(): Promise<any>{
        const auth = firebase.auth();
        const provider = new firebase.auth.OAuthProvider('apple.com');
        return auth.signInWithPopup(provider);
    }

    public sendPasswordResetEmail(email: string) {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    public resumeState(user) {

    }

    public updatePushToken(token: string) {

    }

    public updateOnConnect(user: User) {
        this.user = user;
        this.db.object(`${CollectionConstants.INFO}/${CollectionConstants.CONNECTED}`)
            .valueChanges().subscribe(connected => {
                const status = connected ? UserStatusConstants.ONLINE : UserStatusConstants.OFFLINE;
                this.updateTokenStatus(user.userId, UserStatusConstants.ONLINE);
                this.updateOnDisconnect(user.userId);
            });
    }

    private updateOnDisconnect(userId: string) {
        this.db.database.ref(`${CollectionConstants.USERS}/${userId}`)
            .onDisconnect()
            .update({ status: UserStatusConstants.OFFLINE });
    }

    public updateTokenStatus(userId: string, status: string) {
        this.db.object(`/${CollectionConstants.USERS}/${userId}`)
            .set({ status, userId, device: TriggerConstants.WEB, lastUpdated: new Date().getTime() });
    }
}
