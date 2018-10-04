import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable} from 'rxjs';

const firebase = require("nativescript-plugin-firebase/app");
// import { firestore } from "nativescript-plugin-firebase";


@Injectable()
export class TNSDbService extends DbService {

    constructor(private zone: NgZone) {
        super();
    }

    public setDoc(collectionName, docId, document) {
        const userCollection = firebase.firestore().collection(collectionName);
        userCollection.doc(docId).set(document);
    }

    public updateDoc(collectionName, docId, document) {

    }


    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {
        
        let query = firebase.firestore().collection(collectionName);
        if (queryParams) {
            for (const param of queryParams.condition) {
                query = query.where(param.name, param.comparator, param.value);
            }
        }

        if(path) {
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
                }else {
                    results = snapshot.data();
                  }
                  this.zone.run(() => {
                        observer.next((results.length == 1) ? results[0] : results);
                  });
            });
            return () => unsubscribe();
        });
    }
    public createId() {
        return firebase.createId();
    }

    public getFireStorageReference(filePath) {

    }

    public getFireStore() {

    }

    public getStore(): any {

    }

    public getDoc(collectionName, docId): any {
  
    }

    public upload(filePath, imageBlob): any {

    }

}