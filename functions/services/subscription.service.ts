import { CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class SubscriptionService {

    private static fireStoreClient = admin.firestore();

    /**
    * getSubscriptions
    * return subscription
    */
    static async getSubscriptions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection(CollectionConstants.SUBSCRIPTION).get();
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
