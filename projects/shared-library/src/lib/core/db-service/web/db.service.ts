import { Injectable, Inject, NgZone } from '@angular/core';
import { DbService } from './../db.service';
import { Observable, of } from 'rxjs';
import { User } from '../../../shared/model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';


@Injectable()
export class WebDbService extends DbService {

    constructor(protected _afAuth: AngularFireAuth,
        protected _afStore: AngularFirestore) {
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
        this._afStore.doc(`/${name}/${id}`).set(collection);
    }


    public listenForChanges(name: string, path?: any, queryParams?: Array<{ name: string; comparator: string; value: any }>): Observable<any> {
        return this._afStore.collection(name, ref => {
            let query: any = ref;
            if (queryParams) {
                for (const param of queryParams) {
                    query = query.where(param.name, param.comparator, param.value);
                }
            }
            return query;
        }).doc(path).snapshotChanges().pipe(
            map(actions => {
                return actions.payload.data();
            })
        );
    }

    public createId(){
        // this._afStore.collection('_').doc('_').id;
        return '';
    }
}