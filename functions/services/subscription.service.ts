import admin from '../db/firebase.client';
const subscriptionFireStoreClient = admin.firestore();
/**
 * getSubscriptions
 * return subscription
 */
exports.getSubscriptions = async(): Promise<any> => {
    try {
        return await subscriptionFireStoreClient.collection('subscription').get();
    } catch (error) {
        console.error(error);
        return error;
    }
};
