
import { Subscription } from '../utils/subscription';

/**
 * getSubscriptionCount
 * return count
 */
exports.getSubscriptionCount = (req, res) => {
    const subscription: Subscription = new Subscription();
    subscription.getTotalSubscription()
        .then(subscribers => res.send(subscribers))
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal Server error');
        });
};
