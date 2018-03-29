import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app-store';
import { Subscription, Subscribers } from '../../model';
import * as socialactions from '../../social/store/actions';
import { Subscriber } from 'rxjs/Subscriber';
import { UserService } from './user.service';


@Injectable()
export class SocialService {
    constructor(private db: AngularFirestore,
        private store: Store<AppState>,
        private http: HttpClient,
        private userService: UserService) {
    }

    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription);
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
}
