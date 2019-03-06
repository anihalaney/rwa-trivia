
import { Subscription } from '../utils/subscription';
import { Utils } from '../utils/utils';
import { interceptorConstants } from 'shared-library/shared/model';

export class SubscriptionController {
    /**
     * getSubscriptionCount
     * return count
     */
    static async getSubscriptionCount(req, res): Promise<any> {
        try {
            const subscribers = await Subscription.getTotalSubscription();
            Utils.sendResponse(res, interceptorConstants.SUCCESS, subscribers);
        } catch (error) {
            Utils.sendErr(res, error);
        }
    }
}
