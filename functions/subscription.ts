import { SubscriptionInfo } from '../src/app/model';

export class Subscription {
    private firestoreDb: any;

    constructor(private fire_store_db) {
        this.fire_store_db = fire_store_db;
    }

    getTotalSubscription(): Promise<SubscriptionInfo> {

        return this.fire_store_db.collection('subscription').get()
            .then(snapshot => {
                let count = 0;
                snapshot.forEach(doc => {
                    count++;
                });
                console.log('count-->', count);
                const subscriptionInfo: SubscriptionInfo = new SubscriptionInfo();
                subscriptionInfo.total_subscription = count;
                return Promise.resolve(subscriptionInfo);
            })
            .catch((err) => {
                return Promise.resolve(err);
            });

    }
}
