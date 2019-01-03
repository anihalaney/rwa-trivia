import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable } from 'rxjs';
import { User } from './../../../shared/model';
const firebaseApp = require('nativescript-plugin-firebase/app');
const firebase = require('nativescript-plugin-firebase');
// import { firestore } from "nativescript-plugin-firebase";
import { Store } from '@ngrx/store';
import { UserActions, UIStateActions } from './../../store/actions';


@Injectable()
export class TNSDbService extends DbService {

    constructor(private zone: NgZone,
        protected _store: Store<any>,
        private userActions: UserActions) {
        super();
    }

    public createDoc(collectionName: string, document: any) {
        const collectionRef = firebaseApp.firestore().collection(collectionName);
        return collectionRef.add(document).then((documentRef) => {
            document.id = documentRef.id;
            return this.setDoc(collectionName, documentRef.id, document);
        });
    }

    public setDoc(collectionName: string, docId: any, document: any) {
        const userCollection = firebaseApp.firestore().collection(collectionName);
        return userCollection.doc(docId).set(document);
    }

    public updateDoc(collectionName, docId, document) {
        const userCollection = firebaseApp.firestore().collection(collectionName);
        userCollection.doc(docId).update(document);
    }

    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {

        let query = firebaseApp.firestore().collection(collectionName);

        if (queryParams) {
            for (const param of queryParams.condition) {
                query = query.where(param.name, param.comparator, param.value);
            }
            if (queryParams.orderBy) {
                for (const param of queryParams.orderBy) {
                    query = query.orderBy(param.name, param.value);
                }
            }
            if (queryParams.limit) {
                query = query.limit(queryParams.limit);
            }
        }
        if (path) {
            query = query.doc(path);
        }
        return Observable.create(observer => {
            const unsubscribe = query.onSnapshot((snapshot: any) => {
                let results = [];
                if (snapshot && snapshot.forEach) {
                    snapshot.forEach(doc => results.push({
                        id: doc.id,
                        ...doc.data()
                    }));
                } else {
                    results = snapshot.data();
                }
                this.zone.run(() => {
                    if (results !== undefined) {
                        observer.next(results);
                    } else {
                        observer.next(undefined);
                    }
                });
            });
            return () => unsubscribe();
        });
    }
    public createId() {
        return firebaseApp.createId;
    }

    public getFireStorageReference(filePath: string) {

    }

    public getFireStore() {

    }

    public getStore(): any {

    }

    public getDoc(collectionName: string, docId: any): any {

    }

    public upload(filePath: string, imageBlob: any): any {

    }

}
