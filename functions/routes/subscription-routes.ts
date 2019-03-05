
import * as express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';


class SubscriptionRoutes {

    public subscriptionRoutes: any;

    constructor() {
        this.subscriptionRoutes = express.Router();

        this.subscriptionRoutes.get('/count', SubscriptionController.getSubscriptionCount);
    }
}

export default new SubscriptionRoutes().subscriptionRoutes;

