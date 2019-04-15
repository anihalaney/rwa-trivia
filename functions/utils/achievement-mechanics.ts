import { Achievement } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementService } from '../services/achievement.service';
import { UserAchievementService } from '../services/user-achievement.service';
import { Utils } from './utils';

export class AchievementMechanics {

    static async addNewAchievement(name: string, property: any): Promise<any> {
        try {
            const achievement = new Achievement(name, property);
            const dbAchievement = achievement.getDbModel();

            const achievements: Achievement[] = await AchievementService.getAchievementByPropertyName(achievement.property['name']);

            if (achievements.length > 0) {
                dbAchievement.id = achievements[0].id;
            } else {
                const ref = await AchievementService.addAchievement(dbAchievement);
                dbAchievement.id = ref.id;
            }

            return await AchievementService.setAchievement(dbAchievement);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async checkAchievement(achievement: any, account: Account, propertyNames: Array<string>): Promise<boolean> {

        let result = false;

        if (achievement.property) {
            propertyNames.push(achievement.property.name);
            return AchievementMechanics.checkAchievement(achievement.property, account, propertyNames);
        } else {
            let value;
            try {
                for (const propertyName of propertyNames) {
                    value = (account[propertyName]) ? account[propertyName] : value[propertyName];
                }
                if (value) {
                    switch (achievement.comparator) {
                        case '>':
                            result = value > Number(achievement.value);
                            break;
                        case '>=':
                            result = value >= Number(achievement.value);
                            break;
                        case '<':
                            result = value < Number(achievement.value);
                            break;
                        case '<=':
                            result = value <= Number(achievement.value);
                            break;
                        case '===':
                            result = value === Number(achievement.value);
                            break;
                        case '!=':
                            result = value !== Number(achievement.value);
                            break;
                    }
                }
            } catch (err) {
                console.log('Error : ', err);
                return result;
            }
        }
        return result;
    }

    static async updateAchievement(account: Account): Promise<string> {
        try {

            const achievementIds: string[] = [];
            const achievements: Achievement[] = await AchievementService.getAchievements();

            for (const achievement of achievements) {
                const validStatus = await AchievementMechanics.checkAchievement(achievement, account, []);
                if (validStatus) {
                    achievementIds.push(achievement.id);
                }
            }

            const userAchievementData: any = {};

            userAchievementData.achievements = achievementIds;
            userAchievementData.id = account.id;

            return await UserAchievementService.setUserAchievement(userAchievementData);

        } catch (error) {
            return Utils.throwError(error);
        }
    }

}

