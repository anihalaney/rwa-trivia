import admin from '../db/firebase.client';
/**
 * getSubscriptions
 * return subscription
 */
export class SubscriptionService {

    private static fireStoreClient = admin.firestore();

    static async getSubscriptions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('subscription').get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

