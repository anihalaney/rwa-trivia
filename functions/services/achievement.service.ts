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
     * getAchievementById
     * return Achievement
     */
    static async getAchievementById(id: string): Promise<any> {
        try {
            const achieventData = await AchievementService.achievementFireStoreClient.
                doc(`/${CollectionConstants.ACHIEVEMENTS}/${id}`).get();
            return achieventData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
