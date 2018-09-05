const subscriptionFireBaseClient = require('../db/firebase-client');
const subscriptionFireStoreClient = subscriptionFireBaseClient.firestore();
import { User } from '../../projects/shared-library/src/lib/shared/model';

/**
 * getSubscriptions
 * return subscription
 */
exports.getSubscriptions = (): Promise<any> => {
    return subscriptionFireStoreClient.collection('subscription').get().then((snapshot) => { return snapshot });
};
