import { Account, GeneralConstants, Question, UserStatConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { QuestionService } from '../services/question.service';
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
                    account.contribution = account.contribution ? Utils.changeFieldValue(1) : count;
                }
            }

            return await AccountService.setAccount({ ...account });
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
