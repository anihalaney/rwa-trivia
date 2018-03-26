import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { Subscription } from '../../model';
import * as socialactions from '../../social/store/actions';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';


@Injectable()
export class SocialService {
    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>,
        private http: HttpClient) {
    }

    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription);
        dbSubscription.id = this.db.createId();
        this.db.doc(`/subscription/${dbSubscription.id}`).set(dbSubscription).then(ref => {
            this.store.dispatch(new socialactions.AddSubscriberSuccess());
        });
    }

    getTotalSubscription(): Observable<number> {
        const cntSubject = new Subject<number>();
        this.db.collection('subscription').snapshotChanges().map(v => v).subscribe(values => {
            cntSubject.next(values.length);
        });
        return cntSubject;
    }

    removeSubscription(created_uid: String) {

        this.db.collection(`/subscription/`, ref => ref.where('created_uid', '==', created_uid))
            .valueChanges()
            .take(1)
            .map(qs => qs)
            .subscribe(sub => {
            })

        // this.db.doc('/subscription/' + created_uid).delete().then(ref => {
        //     this.store.dispatch(new socialactions.RemoveSubscriberSuccess());
        // });

    }

}
