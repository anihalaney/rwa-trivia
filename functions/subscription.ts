import { Subscribers } from '../src/app/model';

export class Subscription {
    constructor(private db) {
        this.db = db;
    }

    getTotalSubscription(): Promise<Subscribers> {

        return this.db.collection('subscription').get()
            .then(snapshot => {
                const subscribers: Subscribers = new Subscribers();
                subscribers.count = snapshot.size;
                return subscribers;
            })
        }
}
