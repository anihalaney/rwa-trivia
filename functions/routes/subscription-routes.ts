
import * as express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
export const subscriptionRoutes = express.Router();

subscriptionRoutes.get('/count', SubscriptionController.getSubscriptionCount);
