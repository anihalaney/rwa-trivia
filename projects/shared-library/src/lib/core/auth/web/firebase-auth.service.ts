import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './../firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from './../../components/login/login.component'

@Injectable()
export class WebFirebaseAuthService extends FirebaseAuthService {

    dialogRef: MatDialogRef<LoginComponent>;
    constructor(protected afAuth: AngularFireAuth,
        protected afStore: AngularFirestore,
        private _afstorage: AngularFireStorage,
        public dialog: MatDialog,) {
        super();
    }

    authState(): any {
        return this.afAuth.authState;
    }

    public createUserWithEmailAndPassword(email, password) {

    }

    public getIdToken(user, forceRefresh: boolean) {
        (this.dialogRef) ? this.dialogRef.close() : '';
        return user.getIdToken(forceRefresh);
    }

    public refreshToken(forceRefresh: boolean) {
        return firebase.auth().currentUser.getIdToken(forceRefresh);
    }

    public signOut(){
        this.afAuth.auth.signOut();
    }

    public showLogin(){
        this.dialogRef = this.dialog.open(LoginComponent, {
            disableClose: false
          });
    }

}