import { Subscribers } from '../../projects/shared-library/src/lib/shared/model';
import { SubscriptionService } from '../services/subscription.service';

export class Subscription {
    static async getTotalSubscription(): Promise<Subscribers> {
        try {
            const subscribers: Subscribers = new Subscribers();
            const snapshot = await SubscriptionService.getSubscriptions();
            subscribers.count = snapshot.size;
            return subscribers;
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
