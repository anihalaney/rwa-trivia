import {
    Achievement, AchievementConstants, AchievementRule, pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AchievementRulesService } from '../services/achievement-rules.service';
import { AchievementService } from '../services/achievement.service';
import { Utils } from './utils';
import { PushNotification } from './push-notifications';

export class AchievementMechanics {

    static async addAchievementRule(name: string, property: any, displayOrder: number, iconPath?: any): Promise<any> {
        try {
            const achievementRule = new AchievementRule(name, property, displayOrder, iconPath);
            if (!achievementRule.iconPath) {
                achievementRule.iconPath = Utils.getWebsiteUrl() + '/assets/images/default-achievement.png';
            }
            const ref = await AchievementRulesService.addAchievementRule({ ...achievementRule });
            achievementRule.id = ref.id;

            return await AchievementRulesService.setAchievementRule({ ...achievementRule });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async updateAchievement(account: Account): Promise<string> {
        try {

            const achievementRuleIds: string[] = [];
            const achievementRules: AchievementRule[] = await AchievementRulesService.getAchievementRules();
            const oldAchievementData: Achievement = await AchievementService.getAchievementById(account.id);


            for (const achievementRule of achievementRules) {
                if (account[achievementRule.property.name]) {
                    if (AchievementMechanics.checkAchievement(achievementRule, account, [])) {
                        achievementRuleIds.push(achievementRule.id);
                    }
                }
            }

            const achievementData = new Achievement();

            achievementData.achievements = achievementRuleIds;
            achievementData.id = account.id;

            let achievementIdsForNotification: string[] = [];

            if (!oldAchievementData || (oldAchievementData && !oldAchievementData.achievements)) {
                achievementIdsForNotification = achievementRuleIds;
            } else {
                achievementIdsForNotification = achievementRuleIds.
                    filter((achievementRuleId) => {
                        return oldAchievementData.achievements.indexOf(achievementRuleId) === -1;
                    });
            }

            for (const achievementId of achievementIdsForNotification) {
                const message = `You Achieved ${achievementId} Achievement`;

                PushNotification.sendGamePlayPushNotifications(message, account.id,
                    pushNotificationRouteConstants.ACHIEVEMENT_NOTIFICATION);
            }

            return await AchievementService.setAchievement({ ...achievementData });

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static checkAchievement(achievementRule: any, account: Account, propertyNames: Array<string>): boolean {

        let result = false;

        if (achievementRule.property) {
            propertyNames.push(achievementRule.property.name);
            return AchievementMechanics.checkAchievement(achievementRule.property, account, propertyNames);
        } else {
            let value: any = {};
            for (const propertyName of propertyNames) {
                value = (account[propertyName]) ? account[propertyName] : (value[propertyName] ? value[propertyName] : 'NA');
            }
            if (value) {
                switch (achievementRule.comparator) {
                    case AchievementConstants.GREATER_THAN:
                        result = value > Number(achievementRule.value);
                        break;
                    case AchievementConstants.GREATER_THAN_OR_EQUAL:
                        result = value >= Number(achievementRule.value);
                        break;
                    case AchievementConstants.LESS_THAN:
                        result = value < Number(achievementRule.value);
                        break;
                    case AchievementConstants.LESS_THAN_OR_EQUAL:
                        result = value <= Number(achievementRule.value);
                        break;
                    case AchievementConstants.DOUBLE_EQUAL:
                        result = value === Number(achievementRule.value);
                        break;
                    case AchievementConstants.NOT_EQUAL:
                        result = value !== Number(achievementRule.value);
                        break;
                }
            }
        }
        return result;
    }
}
