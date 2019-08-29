import { CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class UserStatusService {

    private static fireStoreClient: any = admin.firestore();
    private static databaseClient: any = admin.database();

    /**
     * getUserById
     * return user
    */
    static async getUserStatusById(userId: string): Promise<any> {
        try {
            const userData = await UserStatusService.fireStoreClient
                .doc(`/${CollectionConstants.USER_STATUS}/${userId}/`)
                .get();
            return userData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getUserById (Realtime DB)
     * return user
    */
    static async getUserStatusByIdFromRealTimeDb(userId: string): Promise<any> {
        try {
            const userData = await UserStatusService.databaseClient
                .ref(`/${CollectionConstants.USERS}/${userId}/`)
                .once('value', (snapshot) => {
                    return snapshot.val();
                }, (error) => {
                    return Utils.throwError(error);
                });
            return userData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * updateUser
     * return ref
     */
    static async updateUserStatus(dbUser: any): Promise<any> {
        if (dbUser && dbUser.userId) {
            try {
                return await UserStatusService.fireStoreClient
                    .doc(`/${CollectionConstants.USER_STATUS}/${dbUser.userId}`)
                    .set(dbUser, { merge: true });
            } catch (error) {
                return Utils.throwError(error);
            }
        } else {
            return false;
        }
    }



}
