
import { Subscription } from '../utils/subscription';

export class SubscriptionController {
    /**
     * getSubscriptionCount
     * return count
     */
    static async getSubscriptionCount(req, res): Promise<any> {
        try {
            const subscribers = await Subscription.getTotalSubscription();
            return res.status(200).send(subscribers);
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }
}
