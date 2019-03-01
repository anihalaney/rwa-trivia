import { Subscribers } from '../../projects/shared-library/src/lib/shared/model';
import { SubscriptionService } from '../services/subscription.service';
export class Subscription {

    subscriptionService: SubscriptionService = new SubscriptionService();
    constructor() {}

    public async getTotalSubscription(): Promise<Subscribers> {
        try {
            const subscribers: Subscribers = new Subscribers();
            const snapshot = await this.subscriptionService.getSubscriptions();
            subscribers.count = snapshot.size;
            return subscribers;
        } catch (error) {
            return error;
        }
    }
}
