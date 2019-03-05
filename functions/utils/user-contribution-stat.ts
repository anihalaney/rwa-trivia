import {
    User, Question, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';
import { AccountService as userContributionAccountService } from '../services/account.service';

export class UserContributionStat {


    private userDict: { [key: string]: number };

    constructor() {
        this.userDict = {};
    }

    async generateGameStats(): Promise<any> {
        try {
            const questions = await QuestionService.getAllQuestions();

            for (const question of questions.docs) {
                    this.userDict[question.data().created_uid] = (this.userDict[question.data().created_uid]) ?
                        this.userDict[question.data().created_uid] + UserStatConstants.initialContribution :
                        UserStatConstants.initialContribution;
            }

            const userDictPromises = [];
            for (const userId of Object.keys(this.userDict)) {
                userDictPromises.push(this.getUser(userId, this.userDict[userId]));
            }

            return  await Promise.all(userDictPromises);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUser(id: string, count: number): Promise<string> {
        try {
            const account = await userContributionAccountService.getAccountById(id);
            const dbAccount = account.data();
            dbAccount.contribution = (dbAccount.contribution) ? dbAccount.contribution + count : count;
            return await this.updateAccount({ ...dbAccount });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async updateAccount(dbAccount: any): Promise<string> {
        try {
            const ref =  await userContributionAccountService.setAccount(dbAccount);
            if (ref) {
                return dbAccount.id;
            } else {
                return;
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }



}
