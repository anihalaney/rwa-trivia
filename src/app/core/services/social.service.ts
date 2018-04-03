import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../../environments/environment';
import { Subscription, Subscribers } from '../../model';
import { UserService } from './user.service';


@Injectable()
export class SocialService {
    constructor(private db: AngularFirestore,
        private http: HttpClient,
        private userService: UserService) {
    }

    checkSubscription(subscription: Subscription) {
        return this.db.doc(`/subscription/${subscription.email}`)
            .snapshotChanges()
            .take(1)
            .map(s => {
                if (s.payload.exists && s.payload.data().email === subscription.email) {
                    return true;
                } else {
                    return false;
                }
            });

    }
    saveSubscription(subscription: Subscription) {
        const dbSubscription = Object.assign({}, subscription);
        return this.db.doc(`/subscription/${dbSubscription.email}`)
            .set(dbSubscription)
            .then(ref => {
                if (subscription.userId) {
                    this.userService.setSubscriptionFlag(subscription.userId);
                }
            });
    }

    getTotalSubscription(): Observable<Subscribers> {
        const url: string = CONFIG.functionsUrl + '/app/subscription/count';
        return this.http.get<Subscribers>(url);
    }
}
