
import * as express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';


class SubscriptionRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    public subscriptionRoutes: any;

    constructor() {

        this.subscriptionRoutes = express.Router();

        //  '/count'
        this.subscriptionRoutes.get(`${this.FS}${RoutesConstants.COUNT}`, SubscriptionController.getSubscriptionCount);

    }
}

export default new SubscriptionRoutes().subscriptionRoutes;

