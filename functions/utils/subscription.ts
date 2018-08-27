import { Subscribers } from '../../projects/shared-library/src/lib/shared/model';
const subscriptionService = require('../services/subscription.service');

export class Subscription {


    public getTotalSubscription(): Promise<Subscribers> {

        return subscriptionService.getSubscriptions()
            .then(snapshot => {
                const subscribers: Subscribers = new Subscribers();
                subscribers.count = snapshot.size;
                return subscribers;
            })
    }
}
