import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { Subscription, Subscribers, User } from '../../model';
import * as socialactions from '../../social/store/actions';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { UserService } from './user.service';
import { debuglog } from 'util';


@Injectable()
export class SocialService {
    constructor(private db: AngularFirestore,
        private storage: AngularFireStorage,
        private store: Store<AppState>,
        private http: HttpClient,
        private userService: UserService) {
    }

    saveSubscription(subscription: Subscription) {

        const dbSubscription = Object.assign({}, subscription);
        dbSubscription.id = this.db.createId();
        this.db.doc(`/subscription/${dbSubscription.email}`).valueChanges()
            .take(1)
            .subscribe(sub => {
                if (!sub) {
                    this.db.doc(`/subscription/${dbSubscription.email}`).set(dbSubscription).then(ref => {
                        if (subscription.userId) {
                            this.userService.setSubscriptionFlag(subscription.userId);
                        }
                        this.store.dispatch(new socialactions.CheckSubscriptionStatus(false));
                    });
                } else {
                    this.store.dispatch(new socialactions.CheckSubscriptionStatus(true));
                }
            })

    }

    getTotalSubscription(): Observable<Subscribers> {
        const url: string = CONFIG.functionsUrl + '/app/subscription/count';
        return this.http.get<Subscribers>(url);
    }

    removeSubscription(created_uid: String) {

        this.db.collection(`/subscription/`, ref => ref.where('created_uid', '==', created_uid))
            .valueChanges()
            .take(1)
            .map(qs => qs)
            .subscribe(sub => {
                const id = sub[0]['id'];
                this.db.doc('/subscription/' + id).delete().then(ref => {
                    this.store.dispatch(new socialactions.RemoveSubscriberSuccess());
                });
            })



    }

}
