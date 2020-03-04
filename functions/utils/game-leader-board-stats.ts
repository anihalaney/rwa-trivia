
import { Account, AccountConstants, Game, LeaderBoardUsers, PlayerQnA, Question } from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { GameService } from '../services/game.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { QuestionService } from '../services/question.service';
import { Utils } from '../utils/utils';
import { AccountAtomic } from '../model';
import * as stringHash from 'string-hash';
export class GameLeaderBoardStats {

    static async generateGameStats(): Promise<any> {

        const accountDicts: { [key: string]: AccountAtomic } = {};
        const userPromises = [];

        try {

            const games: Game[] = await GameService.getCompletedGames();
            const questionDict = await GameLeaderBoardStats.loadQuestionDictionary();
            const questionTagDict = await GameLeaderBoardStats.loadQuestionTagDictionary();

            for (const game of games) {
                for (const userId of Object.keys(game.stats)) {

                    const account: AccountAtomic = (accountDicts[userId]) ?
                        accountDicts[userId] : new AccountAtomic();
                    const categoryTagsObj =
                    GameLeaderBoardStats.getGameQuestionCategoriesAndTags(game, questionDict, userId, questionTagDict);
                    accountDicts[userId] = GameLeaderBoardStats.calculateAllGameUsersStat(
                        account, userId, game, categoryTagsObj.categoryIds, categoryTagsObj.tagIds
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

    static async loadQuestionTagDictionary(): Promise<{ [key: string]: Array<string> }> {
        const questionDict: { [key: string]: Array<string> } = {};
        try {
            const questions: Question[] = await QuestionService.getAllQuestions();
            for (const question of questions) {
                if (question.categoryIds.length > 0) {
                    questionDict[question.id] = question.tags;
                }
            }
            return questionDict;
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    private static getGameQuestionCategoriesAndTags(game: Game, questionDict: { [key: string]: Array<number> }, userId: string,
        questionTagDict: { [key: string]: Array<string> }): {categoryIds: Array<number>, tagIds: Array<string>} {

        const questionCategoriesTags: { categoryIds: Array<number>, tagIds: Array<string> } = { categoryIds: [], tagIds: [] };
        const questions: PlayerQnA[] = game.playerQnAs.filter(playerQ => playerQ.playerId === userId && playerQ.answerCorrect === true);

        for (const question of questions) {
            const categoryIds: Array<any> = questionDict[question.questionId];
            const tagsIds: Array<any> = questionTagDict[question.questionId];
            if (categoryIds) {
                for (const categoryId of categoryIds) {
                    if (categoryId) {
                        questionCategoriesTags.categoryIds.push(categoryId);
                    }
                }
            }

            if (tagsIds) {
                for (const tagId of tagsIds) {
                    if (tagId) {
                        questionCategoriesTags.tagIds.push(tagId);
                    }
                }
            }
        }
        return questionCategoriesTags;
    }

    private static calculateAllGameUsersStat(account: AccountAtomic, userId: string,
        game: Game, categoryIds: Array<number>, tagIds: Array<string>): AccountAtomic {
        return AccountService.calculateAccountStat(account, game, categoryIds, userId, true, tagIds);
    }

    static async getGameUsers(game: Game): Promise<any> {
        const userPromises = [];
        let categoryTagObj = {categoryIds: [], tagIds: []};
        try {
            for (const userId of Object.keys(game.stats)) {
                categoryTagObj = await GameLeaderBoardStats.getUserQuestionCategoryAndTagIds(game.playerQnAs, userId);
                userPromises.push(GameLeaderBoardStats.calculateUserStat(userId, game, categoryTagObj.categoryIds, categoryTagObj.tagIds));
            }
            return await Promise.all(userPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async getUserQuestionCategoryAndTagIds(gameQuestions: PlayerQnA[], userId: string):
    Promise<{categoryIds: Array<number>, tagIds: Array<string>}> {
        try {
            const categoryTagObj = {categoryIds : [], tagIds: []};
            const questionPromises = [];

            gameQuestions = gameQuestions.filter(gameQuestion => gameQuestion.playerId === userId && gameQuestion.answerCorrect === true);

            for (const gameQuestion of gameQuestions) {
                questionPromises.push(QuestionService.getQuestionById(gameQuestion.questionId));
            }

            const questionResults: Question[] = await Promise.all(questionPromises);
            for (const questionResult of questionResults) {
                for (const categoryId of questionResult.categoryIds) {
                    if (categoryId) {
                        categoryTagObj.categoryIds.push(categoryId);
                    }
                }

                for (const tagId of questionResult.tags) {
                    if (tagId) {
                        categoryTagObj.tagIds.push(tagId);
                    }
                }
            }
            return categoryTagObj;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async calculateUserStat(userId: string, game: Game, categoryIds: Array<number>, tagIds: Array<string>): Promise<string> {
        try {
            const account: AccountAtomic = await AccountService.getAccountById(userId);

            if (account && account.id) {

                return await AccountService.updateAccountData(
                    AccountService.calculateAccountStat(account, game, categoryIds, userId, false, tagIds));
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
            const category = await LeaderBoardService.getAllCategories();
            const categoryIds = [];
            for (const data of category) {
                categoryIds.push(data.id.toString(10));
            }
            for (const id of Object.keys(leaderBoardDict)) {
                let idHash = id;
                if (categoryIds.indexOf(id) < 0) {
                   idHash = await stringHash(id);
                }
                const leaderBoardUsers: LeaderBoardUsers = leaderBoardDict[id];
                for (const userData of leaderBoardUsers.users) {
                   promises.push(LeaderBoardService.setLeaderBoardStatsById(idHash, { ...userData }));
                }
               promises.push(LeaderBoardService.setLeaderBoardStatsData(id, idHash));
            }

           return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
