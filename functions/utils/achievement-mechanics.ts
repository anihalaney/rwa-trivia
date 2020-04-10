import {
    Achievement, AchievementConstants, AchievementRule, pushNotificationRouteConstants, GeneralConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AchievementRulesService } from '../services/achievement-rules.service';
import { AchievementService } from '../services/achievement.service';
import { PushNotification } from './push-notifications';
import { Utils } from './utils';

export class AchievementMechanics {

    static async addAchievementRule(name: string, property: any, displayOrder: number, iconPath?: any): Promise<any> {
        try {
            const achievementRule = new AchievementRule(name, property, displayOrder, iconPath);
            if (!achievementRule.iconPath) {
                achievementRule.iconPath = Utils.getWebsiteUrl() + AchievementConstants.DEFAULT_ACHIEVEMENT_ICON_PATH;
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
            const achievementRulesDict: { [key: string]: AchievementRule } = {};
            for (const achievementRule of achievementRules) {
                achievementRulesDict[achievementRule[GeneralConstants.ID]] = achievementRule;
            }
            const oldAchievementData: Achievement = await AchievementService.getAchievementByUserId(account.id);


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
                    filter((achievementRuleId) => oldAchievementData.achievements.indexOf(achievementRuleId) === -1);
            }

            for (const achievementId of achievementIdsForNotification) {
                PushNotification.sendGamePlayPushNotifications(achievementRulesDict[achievementId].name, account.id,
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
                value = (account[propertyName]) ? account[propertyName] :
                    (value[propertyName] ? value[propertyName] : AchievementConstants.NA);
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

    public static async retrieveAchievements(userId: string): Promise<Array<AchievementRule>> {

        let achievementRules: AchievementRule[] = await AchievementRulesService.getAchievementRules();
        const achievementData: Achievement = await AchievementService.getAchievementByUserId(userId);

        if (achievementData) {
            achievementRules = achievementRules.
                filter((achievementRule) => achievementData.achievements.indexOf(achievementRule.id) !== -1);

            achievementRules = achievementRules.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder));

            achievementRules.map((achievementRule) => {
                delete achievementRule.displayOrder;
                delete achievementRule.id;
                delete achievementRule.property;
                return achievementRule;
            });
        } else {
            achievementRules = [];
        }
        return achievementRules;
    }
}
