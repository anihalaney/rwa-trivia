import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/model';

// @Inject(PlatformFirebaseToken) protected _firebase: any
const firebase = require("nativescript-plugin-firebase/app");
import { firestore } from "nativescript-plugin-firebase";

@Injectable()
export class TNSDbService extends DbService {

    constructor(private zone: NgZone) {
        super();
    }


    public getUser(user: User): Observable<User> {
        let _listenSub: any;

        firebase._firebaseAppFactory
        let res = firebase.firestore().collection("users").where("userId", "==", user.userId);
        return Observable.create(observer => {
            _listenSub = res.onSnapshot((snapshot: any) => {
                let results: any = {};
                if (snapshot && snapshot.forEach) {
                    snapshot.forEach(doc => {
                        results = doc.data();
                    });
                }
                observer.next(results);
            });
        });
    }

    public saveUser(user: User) {
        const userCollection = firebase.firestore().collection("users");
        userCollection.doc(user.userId).set(user);
    }

    public setCollection(name, id, collection) {
        const userCollection = firebase.firestore().collection(name);
        userCollection.doc(id).set(collection);
    }

    public updateCollection(name, id, collection) {

    }

    private _listenSub: any;
    public listenForChanges(name: string, path?: any, queryParams?: Array<{ name: string; comparator: string; value: any }>): Observable<any> {
        if (this._listenSub) {
            this._listenSub();
            this._listenSub = null;
        }
        let query = firebase.firestore().collection(name);
        if (queryParams) {
            for (const param of queryParams) {
                query = query.where(param.name, param.comparator, param.value);
            }
        }
        return Observable.create(observer => {
            this._listenSub = query.onSnapshot((snapshot: any) => {
                let results = [];
                if (snapshot && snapshot.forEach) {
                    snapshot.forEach(doc => results.push({
                        id: doc.id,
                        ...doc.data()
                    }));

                }
                observer.next((results.length == 1) ? results[0] : results);
            });

        });
    }

    public createId() {
        return firebase.createId();
    }

    public getFireStoreReference(filePath) {

    }

    public getFireStore() {

    }

    public getStore(): any {

    }

    public getCollection(collectionName, docId): any {

    }

}