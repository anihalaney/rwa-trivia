import { Account, Game, Question, AccountConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { GameService } from '../services/game.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { QuestionService } from '../services/question.service';
import { Utils } from '../utils/utils';

export class GameLeaderBoardStats {

    static accountDict: { [key: string]: Account } = {};


    static async generateGameStats(): Promise<any> {
        const userPromises = [];
        try {
            const games: Game[] = await GameService.getCompletedGames();

            const questionDict = await this.loadQuestionDictionary();

            for (const game of games) {
                for (const userId of Object.keys(game.stats)) {
                    this.calculateAllGameUsersStat(userId, game, this.getGameQuestionCategories(game, questionDict));
                }
            }

            for (const userId of Object.keys(this.accountDict)) {
                const account: Account = this.accountDict[userId];
                account.id = userId;
                userPromises.push(AccountService.updateAccountData({ ...account }));
            }

            const userResults = await Promise.all(userPromises);
            this.accountDict = {};

            return userResults;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async loadQuestionDictionary(): Promise<{ [key: string]: Array<number> }> {
        const questionDict: { [key: string]: Array<number> } = {};

        try {
            const questions: Question[] = await QuestionService.getAllQuestions();

            for (const question of questions) {
                if (question.categoryIds.length > 0) {
                    questionDict[question.id] = question.categoryIds;
                }
            }
            return questionDict;

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static getGameQuestionCategories(game: Game, questionDict: { [key: string]: Array<number> }): Array<number> {
        const questionCategories: Array<number> = [];
        for (const playerQnA of game.playerQnAs) {
            const categoryIds: Array<number> = questionDict[playerQnA.questionId];
            if (categoryIds) {
                for (const categoryId of categoryIds) {
                    if (categoryId && questionCategories.indexOf(categoryId) === -1) {
                        questionCategories.push(categoryId);
                    }
                }
            }
        }

        return questionCategories;
    }

    private static calculateAllGameUsersStat(userId: string, game: Game, categoryIds: Array<number>): void {
        const account: Account = (this.accountDict[userId]) ? this.accountDict[userId] : new Account();
        this.accountDict[userId] = AccountService.calculateAccountStat(account, game, categoryIds, userId);
    }


    static async  getGameUsers(game: Game): Promise<any> {
        const userPromises = [];
        const questionPromises = [];
        const categoryIds = [];

        for (const playerQnA of game.playerQnAs) {
            questionPromises.push(QuestionService.getQuestionById(playerQnA.questionId));
        }

        try {
            const questionResults: Question[] = await Promise.all(questionPromises);
            for (const question of questionResults) {
                for (const categoryId of question.categoryIds) {
                    if (categoryId && categoryIds.indexOf(categoryId) === -1) {
                        categoryIds.push(categoryId);
                    }
                }
            }
            for (const userId of Object.keys(game.stats)) {
                userPromises.push(this.calculateUserStat(userId, game, categoryIds));
            }

            return await Promise.all(userPromises);
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    private static async calculateUserStat(userId: string, game: Game, categoryIds: Array<number>): Promise<string> {
        try {
            const account: Account = await AccountService.getAccountById(userId);

            if (account && account.id) {

                return await AccountService.updateAccountData(
                    AccountService.calculateAccountStat(account, game, categoryIds, userId));
            }
            return AccountConstants.ACCOUNT_DOES_NOT_EXIST;
        } catch (error) {
            return Utils.throwError(error);
        }

    }


    static async calculateGameLeaderBoardStat(): Promise<string> {
        try {
            const accounts: Account[] = await AccountService.getAccounts();
            let lbsStats = await LeaderBoardService.getLeaderBoardStats();

            for (const account of accounts) {
                lbsStats = LeaderBoardService.calculateLeaderBoardStats(account, lbsStats);
            }

            const updateLBSStatResult = await LeaderBoardService.setLeaderBoardStats({ ...lbsStats });
            return updateLBSStatResult;
        } catch (error) {
            return Utils.throwError(error);
        }

    }

}
