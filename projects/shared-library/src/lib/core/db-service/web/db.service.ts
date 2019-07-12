import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isArray } from 'util';
import { DbService } from './../db.service';


@Injectable()
export class WebDbService extends DbService {

    constructor(protected _afAuth: AngularFireAuth,
        protected _afStore: AngularFirestore,
        private _afstorage: AngularFireStorage) {
        super();
    }

    public createDoc(collectionName: string, document: any) {
        const collectionRef = this._afStore.collection(collectionName);
        return collectionRef.add(document).then((documentRef) => {
            document.id = documentRef.id;
            return this.setDoc(collectionName, documentRef.id, document);
        });
    }

    public CreateDocWithoutDocID(collectionName: string, document: any) {
        const collectionRef = this._afStore.collection(collectionName);
        return collectionRef.add(document);
    }

    public setDoc(collectionName: string, docId: any, document: any) {
        return this._afStore.doc(`/${collectionName}/${docId}`).set(document, { merge: true });
    }

    public updateDoc(collectionName: string, docId: any, document: any) {
        return this._afStore.doc(`/${collectionName}/${docId}`).set(document, { merge: true });
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

    public getFireStorageReference(filePath: string): AngularFireStorageReference {
        return this._afstorage.ref(filePath);
    }

    public getFireStore() {
        return this._afStore;
    }

    public getDoc(collectionName: string, docId: any): any {
        return this._afStore.firestore.collection(collectionName).doc(docId);
    }

    public upload(filePath: string, imageBlob: any) {
        return this._afstorage.upload(filePath, imageBlob);
    }
}
