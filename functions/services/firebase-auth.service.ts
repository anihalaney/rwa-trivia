import admin from '../db/firebase.client';

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
            console.log('Error : ', error);
            throw error;
        }
    }
}
