
import { Subscription } from '../utils/subscription';

/**
 * getSubscriptionCount
 * return count
 */
exports.getSubscriptionCount = async (req, res): Promise<any> => {
    const subscription: Subscription = new Subscription();
    try {
        const subscribers = await subscription.getTotalSubscription();
        res.send(subscribers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server error');
        return error;
    }
};
