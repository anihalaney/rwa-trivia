
import { Account, AccountConstants, Game, LeaderBoardUsers, PlayerQnA, Question } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { GameService } from '../services/game.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { QuestionService } from '../services/question.service';
import { Utils } from '../utils/utils';
import { AccountAtomic } from '../model';

export class GameLeaderBoardStats {

    static async generateGameStats(): Promise<any> {

        const accountDicts: { [key: string]: AccountAtomic } = {};
        const userPromises = [];

        try {

            const games: Game[] = await GameService.getCompletedGames();
            const questionDict = await GameLeaderBoardStats.loadQuestionDictionary();

            for (const game of games) {
                for (const userId of Object.keys(game.stats)) {

                    const account: AccountAtomic = (accountDicts[userId]) ?
                        accountDicts[userId] : new AccountAtomic();

                    accountDicts[userId] = GameLeaderBoardStats.calculateAllGameUsersStat(
                        account, userId, game, GameLeaderBoardStats.getGameQuestionCategories(game, questionDict, userId)
                    );
                }
            }
            for (const userId of Object.keys(accountDicts)) {
                const account: AccountAtomic = accountDicts[userId];
                account.id = userId;
                userPromises.push(AccountService.setAccount({ ...account }));
            }
            return await Promise.all(userPromises);
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


    private static getGameQuestionCategories(game: Game, questionDict: { [key: string]: Array<number> }, userId: string): Array<number> {

        const questionCategories: Array<number> = [];
        const questions: PlayerQnA[] = game.playerQnAs.filter(playerQ => playerQ.playerId === userId && playerQ.answerCorrect === true);

        for (const question of questions) {
            const categoryIds: Array<number> = questionDict[question.questionId];
            if (categoryIds) {
                for (const categoryId of categoryIds) {
                    if (categoryId) {
                        questionCategories.push(categoryId);
                    }
                }
            }
        }
        return questionCategories;
    }

    private static calculateAllGameUsersStat(account: AccountAtomic, userId: string,
        game: Game, categoryIds: Array<number>): AccountAtomic {
        return AccountService.calculateAccountStat(account, game, categoryIds, userId, true);
    }

    static async getGameUsers(game: Game): Promise<any> {
        const userPromises = [];
        let categoryIds = [];
        try {
            for (const userId of Object.keys(game.stats)) {
                categoryIds = await GameLeaderBoardStats.getUserQuestionCategoryIds(game.playerQnAs, userId);
                userPromises.push(GameLeaderBoardStats.calculateUserStat(userId, game, categoryIds));
            }
            return await Promise.all(userPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async getUserQuestionCategoryIds(gameQuestions: PlayerQnA[], userId: string): Promise<Array<number>> {
        try {
            const categoryIds = [];
            const questionPromises = [];

            gameQuestions = gameQuestions.filter(gameQuestion => gameQuestion.playerId === userId && gameQuestion.answerCorrect === true);

            for (const gameQuestion of gameQuestions) {
                questionPromises.push(QuestionService.getQuestionById(gameQuestion.questionId));
            }

            const questionResults: Question[] = await Promise.all(questionPromises);
            for (const questionResult of questionResults) {
                for (const categoryId of questionResult.categoryIds) {
                    if (categoryId) {
                        categoryIds.push(categoryId);
                    }
                }
            }
            return categoryIds;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async calculateUserStat(userId: string, game: Game, categoryIds: Array<number>): Promise<string> {
        try {
            const account: AccountAtomic = await AccountService.getAccountById(userId);

            if (account && account.id) {

                return await AccountService.updateAccountData(
                    AccountService.calculateAccountStat(account, game, categoryIds, userId, false));
            }
            return AccountConstants.ACCOUNT_DOES_NOT_EXIST;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async calculateGameLeaderBoardStat(): Promise<any> {
        try {
            let leaderBoardDict: { [key: string]: LeaderBoardUsers } = {};

            const accounts: Account[] = await AccountService.getAccounts();
            for (const account of accounts) {
                leaderBoardDict = await LeaderBoardService.calculateLeaderBoardStats(account, leaderBoardDict);
            }

            return await GameLeaderBoardStats.setLeaderBoardStat(leaderBoardDict);

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async setLeaderBoardStat(leaderBoardDict: { [key: string]: LeaderBoardUsers }): Promise<any> {
        try {

            const promises = [];

            for (const id of Object.keys(leaderBoardDict)) {
                const leaderBoardUsers: LeaderBoardUsers = leaderBoardDict[id];
                promises.push(LeaderBoardService.setLeaderBoardStatsById(id, { ...leaderBoardUsers }));
            }

            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
