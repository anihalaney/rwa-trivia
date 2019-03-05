import admin from '../db/firebase.client';

export class SubscriptionService {

    private static fireStoreClient = admin.firestore();

    /**
    * getSubscriptions
    * return subscription
    */
    static async getSubscriptions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('subscription').get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
