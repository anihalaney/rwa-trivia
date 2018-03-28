import { Subscribers } from '../src/app/model';

export class Subscription {
    private firestoreDb: any;

    constructor(private db) {
        this.db = db;
    }

    getTotalSubscription(): Promise<Subscribers> {

        return this.db.collection('subscription').get()
            .then(snapshot => {
                const subscriptionInfo: Subscribers = new Subscribers();
                subscriptionInfo.count = snapshot.size;
                return Promise.resolve(subscriptionInfo);
            })
            .catch((err) => {
                return Promise.resolve(err);
            });

    }
}
