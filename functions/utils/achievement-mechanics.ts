import { AchievementRule, AchievementConstants, Achievement } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementRulesService } from '../services/achievement-rules.service';
import { AchievementService } from '../services/achievement.service';
import { Utils } from './utils';

export class AchievementMechanics {

    static async addAchievementRule(name: string, property: any): Promise<any> {
        try {
            const achievementRule = new AchievementRule(name, property);
            const dbAchievementRule = achievementRule.getDbModel();

            const ref = await AchievementRulesService.addAchievementRule(dbAchievementRule);
            dbAchievementRule.id = ref.id;

            return await AchievementRulesService.setAchievementRule(dbAchievementRule);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async updateAchievement(account: Account): Promise<string> {
        try {

            const achievementRuleIds: string[] = [];
            const achievementRules: AchievementRule[] = await AchievementRulesService.getAchievementRules();

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
