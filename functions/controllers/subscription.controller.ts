
import { Subscription } from '../utils/subscription';

/**
 * getSubscriptionCount
 * return count
 */


export class SubscriptionController {

    constructor() {
    }

    public async getSubscriptionCount(req, res): Promise<any> {
        const subscription: Subscription = new Subscription();
        try {
            const subscribers = await subscription.getTotalSubscription();
            res.status(200).send(subscribers);
        } catch (error) {
            res.status(500).send('Internal Server error');
            return error;
        }
    }
}
