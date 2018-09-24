import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable, of } from 'rxjs';

const firebase = require("nativescript-plugin-firebase/app");
// import { firestore } from "nativescript-plugin-firebase";


@Injectable()
export class TNSDbService extends DbService {

    constructor(private zone: NgZone) {
        super();
    }

    public setCollection(name, id, collection) {
        const userCollection = firebase.firestore().collection(name);
        userCollection.doc(id).set(collection);
    }

    public updateCollection(name, id, collection) {

    }

    private _listenSub: any;
    public valueChanges(name: string, path?: any, queryParams?: any): Observable<any> {
        if (this._listenSub) {
            this._listenSub();
            this._listenSub = null;
        }
        let query = firebase.firestore().collection(name);
        if (queryParams) {
            for (const param of queryParams.condition) {
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

    public upload(filePath, imageBlob): any {

    }

}