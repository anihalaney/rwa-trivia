
import * as express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
const router = express.Router();

const subscriptionController: SubscriptionController = new SubscriptionController();

router.get('/count', subscriptionController.getSubscriptionCount);

module.exports = router;
