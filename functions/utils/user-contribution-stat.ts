import { UserStatConstants, Account, Question } from '../../projects/shared-library/src/lib/shared/model';
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
                this.userDict[created_uid] = (this.userDict[created_uid]) ?
                    this.userDict[created_uid] + UserStatConstants.initialContribution :
                    UserStatConstants.initialContribution;
            }

            const userDictPromises = [];
            for (const userId of Object.keys(this.userDict)) {
                userDictPromises.push(this.getUser(userId, this.userDict[userId]));
            }

            return await Promise.all(userDictPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async getUser(id: string, count: number): Promise<string> {
        try {
            const account: Account = await AccountService.getAccountById(id);
            account.contribution = (account.contribution) ? account.contribution + count : count;
            return await AccountService.setAccount({ ...account });
        } catch (error) {
            return Utils.throwError(error);
        }
    }


}
