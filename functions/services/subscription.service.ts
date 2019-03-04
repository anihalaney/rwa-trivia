import admin from '../db/firebase.client';
/**
 * getSubscriptions
 * return subscription
 */
export class SubscriptionService {

    static fireStoreClient = admin.firestore();

    public static async getSubscriptions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('subscription').get();
        } catch (error) {
            throw error;
        }
    }
}

