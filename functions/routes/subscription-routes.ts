
import * as express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
const router = express.Router();

router.get('/count', SubscriptionController.getSubscriptionCount);

module.exports = router;
