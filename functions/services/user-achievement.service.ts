import { CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class UserAchievementService {

    private static userAchievementFireStoreClient = admin.firestore();

    /**
     * setUserAchievement
     * return ref
     */
    static async setUserAchievement(userAchievement: any): Promise<any> {
        try {
            return await UserAchievementService.userAchievementFireStoreClient
                .doc(`/${CollectionConstants.USER_ACHIEVEMENTS}/${userAchievement.id}`)
                .set(userAchievement);

        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
