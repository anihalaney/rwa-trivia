import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { isArray } from 'util';


@Injectable()
export class WebDbService extends DbService {

    constructor(protected _afAuth: AngularFireAuth,
        protected _afStore: AngularFirestore,
        private _afstorage: AngularFireStorage) {
        super();
    }

    public setDoc(collectionName, docId, document) {
        return this._afStore.doc(`/${collectionName}/${docId}`).set(document);
    }

    public updateDoc(collectionName, docId, document) {
        return this._afStore.doc(`/${collectionName}/${docId}`).update(document);
    }


    public valueChanges(collectionName: string, path?: any, queryParams?: any): Observable<any> {
        let query = this._afStore.collection(collectionName, ref => {
            let query: any = ref;
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
            return query;
        })

        if (path) {
            return query.doc(path).snapshotChanges().pipe(
                map(actions => {
                    return actions.payload.data();
                })
            );
        } else {
            return query.snapshotChanges().pipe(
                map(actions => {
                    if (isArray(actions)) {
                        return actions.map(a => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            return { id, ...data };
                        });
                    }
                })
            );
        }
    }


    public createId() {
        return this._afStore.createId();
    }

    public getFireStorageReference(filePath): AngularFireStorageReference {
        return this._afstorage.ref(filePath);
    }

    public getFireStore() {
        return this._afStore;
    }

    public getDoc(collectionName, docId): any {
        return this._afStore.firestore.collection(collectionName).doc(docId);
    }

    public upload(filePath, imageBlob) {
        return this._afstorage.upload(filePath, imageBlob);
    }

}