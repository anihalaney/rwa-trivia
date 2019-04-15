import { Achievement, AchievementConstants, GeneralConstants, UserAchievement } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementService } from '../services/achievement.service';
import { UserAchievementService } from '../services/user-achievement.service';
import { Utils } from './utils';

export class AchievementMechanics {

    static async addNewAchievement(name: string, property: any): Promise<any> {
        try {
            const achievement = new Achievement(name, property);
            const dbAchievement = achievement.getDbModel();

            const ref = await AchievementService.addAchievement(dbAchievement);
            dbAchievement.id = ref.id;


            return await AchievementService.setAchievement(dbAchievement);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async updateAchievement(account: Account): Promise<string> {
        try {

            const achievementIds: string[] = [];
            const achievements: Achievement[] = await AchievementService.getAchievements();

            for (const achievement of achievements) {
                if (account[achievement.property.name]) {
                    if (AchievementMechanics.checkAchievement(achievement, account, [])) {
                        achievementIds.push(achievement.id);
                    }
                }
            }

            const userAchievementData = new UserAchievement();

            userAchievementData.achievements = achievementIds;
            userAchievementData.id = account.id;

            return await UserAchievementService.setUserAchievement({ ...userAchievementData });

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static checkAchievement(achievement: any, account: Account, propertyNames: Array<string>): boolean {

        let result = false;

        if (achievement.property) {
            propertyNames.push(achievement.property.name);
            return AchievementMechanics.checkAchievement(achievement.property, account, propertyNames);
        } else {
            let value: any = {};
            for (const propertyName of propertyNames) {
                value = (account[propertyName]) ? account[propertyName] : (value[propertyName] ? value[propertyName] : 'NA');
            }
            if (value) {
                switch (achievement.comparator) {
                    case AchievementConstants.GREATER_THAN:
                        result = value > Number(achievement.value);
                        break;
                    case AchievementConstants.GREATER_THAN_OR_EQUAL:
                        result = value >= Number(achievement.value);
                        break;
                    case AchievementConstants.LESS_THAN:
                        result = value < Number(achievement.value);
                        break;
                    case AchievementConstants.LESS_THAN_OR_EQUAL:
                        result = value <= Number(achievement.value);
                        break;
                    case AchievementConstants.DOUBLE_EQUAL:
                        result = value === Number(achievement.value);
                        break;
                    case AchievementConstants.NOT_EQUAL:
                        result = value !== Number(achievement.value);
                        break;
                }
            }
        }
        return result;
    }

}

