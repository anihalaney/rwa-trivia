import { CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class AchievementService {

    private static achievementFireStoreClient = admin.firestore();

    /**
     * setAchievement
     * return ref
     */
    static async setAchievement(achievement: any): Promise<any> {
        try {
            return await AchievementService.achievementFireStoreClient
                .doc(`/${CollectionConstants.ACHIEVEMENTS}/${achievement.id}`)
                .set(achievement);

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getAchievementByUserId
     * return Achievement
     */
    static async getAchievementByUserId(userId: string): Promise<any> {
        try {
            const achieventData = await AchievementService.achievementFireStoreClient.
                doc(`/${CollectionConstants.ACHIEVEMENTS}/${userId}`).get();
            return achieventData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
