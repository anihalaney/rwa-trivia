import { CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class AchievementRulesService {

    private static achievementRulesFireStoreClient = admin.firestore();

    /**
     * addAchievementRule
     * return ref
     */
    static async addAchievementRule(achievementRule: any): Promise<any> {
        try {
            return await AchievementRulesService.achievementRulesFireStoreClient
                .collection(CollectionConstants.ACHIEVEMENT_RULES).add(achievementRule);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setAchievementRule
     * return ref
     */
    static async setAchievementRule(achievementRule: any): Promise<any> {
        try {
            return await AchievementRulesService.achievementRulesFireStoreClient
                .doc(`/${CollectionConstants.ACHIEVEMENT_RULES}/${achievementRule.id}`)
                .set(achievementRule, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAchievementRules
     * return AchievementRule[]
     */
    static async getAchievementRules(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await AchievementRulesService.achievementRulesFireStoreClient
                    .collection(CollectionConstants.ACHIEVEMENT_RULES).get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
