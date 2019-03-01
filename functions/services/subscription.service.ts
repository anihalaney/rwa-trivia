import admin from '../db/firebase.client';
/**
 * getSubscriptions
 * return subscription
 */
export class SubscriptionService {

    fireStoreClient: any;

    constructor() {
        this.fireStoreClient = admin.firestore();
    }

    public async getSubscriptions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('subscription').get();
        } catch (error) {
            return error;
        }
    }
}

