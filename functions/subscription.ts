import { Subscribers } from '../src/app/model';

export class Subscription {
    private firestoreDb: any;

    constructor(private db) {
        this.db = db;
    }

    getTotalSubscription() {

        return this.db.collection('subscription').get()
            .then(snapshot => {
                const subscriptionInfo: Subscribers = new Subscribers();
                subscriptionInfo.count = snapshot.size;
                return subscriptionInfo;
            })
            .catch((err) => {
                return Promise.resolve(err);
            });

    }
}
