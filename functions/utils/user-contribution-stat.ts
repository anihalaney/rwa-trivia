import { Account, Achievement, GeneralConstants, Question, User, UserStatConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AchievementService } from '../services/achievement.service';
import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { Utils } from './utils';

export class UserContributionStat {


    private static userDict: { [key: string]: number } = {};

    static async generateGameStats(): Promise<any> {
        try {
            const questions: Question[] = await QuestionService.getAllQuestions();

            for (const question of questions) {
                const created_uid = question.created_uid;
                UserContributionStat.userDict[created_uid] = (UserContributionStat.userDict[created_uid]) ?
                    UserContributionStat.userDict[created_uid] + UserStatConstants.initialContribution :
                    UserStatConstants.initialContribution;
            }

            const userDictPromises = [];
            for (const userId of Object.keys(UserContributionStat.userDict)) {
                userDictPromises.push(UserContributionStat.getUser(userId, UserContributionStat.userDict[userId], true));
            }

            const result = await Promise.all(userDictPromises);

            UserContributionStat.userDict = {};
            return result;

        } catch (error) {
            console.error(GeneralConstants.Error_Message, error);
        }
    }

    static async getUser(id: string, count: number, isMigrationScript: boolean): Promise<string> {
        try {
            const account: Account = await AccountService.getAccountById(id);

            if (account) {
                if (isMigrationScript) {
                    account.contribution = count;
                } else {
                    account.contribution = account.contribution ? (account.contribution + count) : count;
                }
            }

            return await AccountService.setAccount({ ...account });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async achievementLogic(achievement: any, account: Account, propertyNames: Array<string>): Promise<boolean> {

        let result = false;
        
        if (achievement.property) {
            propertyNames.push(achievement.property.name);
            return UserContributionStat.achievementLogic(achievement.property, account, propertyNames);
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

            let achievementArrays: string[] = [];
            const dbUser: User = await UserService.getUserById(account.id);
            const achievements: Achievement[] = await AchievementService.getAchievements();

            for (const achievement of achievements) {
                const res = await UserContributionStat.achievementLogic(achievement, account,[]);
                if (res) {
                    achievementArrays.push(achievement.id);
                }
            }

            dbUser.achievements = achievementArrays;

            return await UserService.updateUser(dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }



}
