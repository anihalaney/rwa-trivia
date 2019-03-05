import { UserStatConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { QuestionService } from '../services/question.service';

export class UserContributionStat {


    private static userDict: { [key: string]: number } = {};

    static async generateGameStats(): Promise<any> {
        try {
            const questions = await QuestionService.getAllQuestions();

            for (const question of questions.docs) {
                const created_uid = question.data().created_uid;
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
            console.error('Error : ', error);
            throw error;
        }
    }

    static async getUser(id: string, count: number): Promise<string> {
        try {
            const account = await AccountService.getAccountById(id);
            const dbAccount = account.data();
            dbAccount.contribution = (dbAccount.contribution) ? dbAccount.contribution + count : count;
            return await AccountService.setAccount({ ...dbAccount });
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


}
