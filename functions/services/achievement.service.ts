import { CollectionConstants, AchievementConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class AchievementService {

    private static achievementFireStoreClient = admin.firestore();

    /**
     * addAchievement
     * return ref
     */
    static async addAchievement(achievement: any): Promise<any> {
        try {
            return  await AchievementService.achievementFireStoreClient.collection(CollectionConstants.ACHIEVEMENTS).add(achievement);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

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
     * getAchievementByPropertyName
     * return Achievement[]
     */
    static async getAchievementByPropertyName(name: string): Promise<any>  {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await AchievementService.achievementFireStoreClient
                    .collection(CollectionConstants.ACHIEVEMENTS)
                    .where(AchievementConstants.PROPERTY_DOT_NAME, GeneralConstants.DOUBLE_EQUAL, name)
                    .get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAchievements
     * return Achievements[]
     */
    static async getAchievements(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await AchievementService.achievementFireStoreClient
                    .collection(CollectionConstants.ACHIEVEMENTS).get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
