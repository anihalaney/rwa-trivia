
import { Account, Game, Question, AccountConstants, PlayerQnA, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { GameService } from '../services/game.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { QuestionService } from '../services/question.service';
import { Utils } from '../utils/utils';

export class GameLeaderBoardStats {

    static async generateGameStats(): Promise<any> {

        const accountDicts: { [key: string]: Account } = {};
        const userPromises = [];

        try {
            const games: Game[] = await GameService.getCompletedGames();

            const questionDict = await GameLeaderBoardStats.loadQuestionDictionary();

            for (const game of games) {
                for (const userId of Object.keys(game.stats)) {

                    const account: Account = (accountDicts[userId]) ?
                        accountDicts[userId] : new Account();

                    accountDicts[userId] = GameLeaderBoardStats.calculateAllGameUsersStat(
                        account, userId, game, GameLeaderBoardStats.getGameQuestionCategories(game, questionDict, userId)
                    );
                }
            }

            for (const userId of Object.keys(accountDicts)) {
                const account: Account = accountDicts[userId];
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

    private static calculateAllGameUsersStat(account: Account, userId: string, game: Game, categoryIds: Array<number>): Account {
        return AccountService.calculateAccountStat(account, game, categoryIds, userId);
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
