import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { map } from 'rxjs/operators';
import { isArray } from 'util';


@Injectable()
export class WebDbService extends DbService {

    constructor(protected _afAuth: AngularFireAuth,
        protected _afStore: AngularFirestore,
        private _afstorage: AngularFireStorage) {
        super();
    }

    public getUser(user: User): Observable<User> {
        console.log('db web');
        return of();
    }

    public saveUser(user: User) {
        console.log('db web');
    }

    public setCollection(name, id, collection) {
        this._afStore.doc(`/${name}/${id}`).set(collection);
    }

    public updateCollection(name, id, collection) {
        this._afStore.doc(`/${name}/${id}`).update(collection);
    }


    public listenForChanges(name: string, path?: any, queryParams?: any): Observable<any> {
        let query = this._afStore.collection(name, ref => {
            let query: any = ref;
            if (queryParams) {
                for (const param of queryParams.condition) {
                    query = query.where(param.name, param.comparator, param.value);
                }
                if (queryParams.orderBy) {
                    query = query.orderBy(queryParams.orderBy.name, queryParams.orderBy.value);
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

    public getFireStoreReference(filePath): AngularFireStorageReference {
        return this._afstorage.ref(filePath);
    }

    public getFireStore() {
        return this._afStore.firestore;
    }

    public getCollection(collectionName, docId): any {
        return this._afStore.firestore.collection(collectionName).doc(docId)
    }

    public upload(filePath, imageBlob) {
        return this._afstorage.upload(filePath, imageBlob).snapshotChanges();
    }
}