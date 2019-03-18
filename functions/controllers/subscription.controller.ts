
import { Subscription } from '../utils/subscription';
import { Utils } from '../utils/utils';
import { interceptorConstants } from '../../projects/shared-library/src/lib/shared/model';

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
            Utils.sendError(res, error);
        }
    }

}
