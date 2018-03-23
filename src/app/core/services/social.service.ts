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


@Injectable()
export class SocialService {
    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>,
        private http: HttpClient) {
    }

    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription); // object to be saved
        this.db.doc(`/subscription/${dbSubscription.userId}`).set(dbSubscription).then(ref => {
            // this.store.dispatch(this.userActions.addUserProfileSuccess());
           // this.store.dispatch(new socialactions.AddSubscriberSuccess());
        });
    }

}