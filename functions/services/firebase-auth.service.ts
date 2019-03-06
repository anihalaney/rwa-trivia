import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class FirebaseAuthService {
    private static fireBaseAuthClient = admin.auth();
    /**
     * getUsers
     * return users
     */
    static async getAuthUsers(nextPageToken?: string): Promise<any> {
        try {
            return await this.fireBaseAuthClient.listUsers(1000, nextPageToken);
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
