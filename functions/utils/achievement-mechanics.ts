import { Achievement, User } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementService } from '../services/achievement.service';
import { Utils } from './utils';
import { UserService } from '../services/user.service';

export class AchievementMechanics {

    static async addNewAchievement(name: string, property: any): Promise<any> {
        try {
                let achievement = new Achievement(name, property);
                let dbAchievement = achievement.getDbModel();
                
                const achievements: Achievement[] = await AchievementService.getAchievementByPropertyName(achievement.property['name']);
                
                if(achievements.length > 0 ) {
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
                for (const propertyName  of propertyNames) {
                    value = (account[propertyName]) ? account[propertyName] : value[propertyName];
                }
                if(value ) {
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
                            result = value != Number(achievement.value);
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

            let achievementIds: string[] = [];
            const dbUser: User = await UserService.getUserById(account.id);
            const achievements: Achievement[] = await AchievementService.getAchievements();

            for (const achievement of achievements) {
                const res = await AchievementMechanics.checkAchievement(achievement, account,[]);
                if (res) {
                    achievementIds.push(achievement.id);
                }
            }

            dbUser.achievements = achievementIds;

            return await UserService.updateUser(dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}

