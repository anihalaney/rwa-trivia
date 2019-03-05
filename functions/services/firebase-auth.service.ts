import admin from '../db/firebase.client';
const fireBaseAuthClient = admin.auth();


export class FirebaseAuthService {

    /**
     * getUsers
     * return users
     */
    static async getAuthUsers(nextPageToken?: string): Promise<any> {
        try {
            return await fireBaseAuthClient.listUsers(1000, nextPageToken);
        } catch (error) {
            console.log('Error listing users:', error);
            throw error;
        }
    };
}
