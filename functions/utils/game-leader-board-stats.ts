import { QuestionService } from '../services/question.service';
const leaderBoardAccountService = require('../services/account.service');
const leaderBoardService = require('../services/leaderboard.service');

import {
    Game, Account, Question
} from '../../projects/shared-library/src/lib/shared/model';
import { GameService } from '../services/game.service';


export class GameLeaderBoardStats {

    accountDict: { [key: string]: Account };

    constructor() {
        this.accountDict = {};
    }

    public async generateGameStats(): Promise<any> {
        const userPromises = [];
        let games;
        try {
            games = await GameService.getCompletedGames();

            games = games.docs.map(game => Game.getViewModel(game.data()));

            const questionDict = await this.loadQuestionDictionary();

            for (const game of games) {
                for (const userId of Object.keys(game.stats)) {
                    this.calculateAllGameUsersStat(userId, game, this.getGameQuestionCategories(game, questionDict));
                }
            }

            for (const userId of Object.keys(this.accountDict)) {
                const account: Account = this.accountDict[userId];
                account.id = userId;
                userPromises.push(leaderBoardAccountService.updateAccountData({ ...account }));
            }

            const userResults = await Promise.all(userPromises);
            this.accountDict = {};

            return userResults;
        } catch (err) {
            console.log('err', err);
        }
    }

    public async loadQuestionDictionary(): Promise<{ [key: string]: Array<number> }> {
        const questionDict: { [key: string]: Array<number> } = {};

        try {
            const snapshots = await QuestionService.getAllQuestions();
            if (snapshots.empty) {
                console.log('questions do not exist');
                return Promise.reject(snapshots);
            } else {
                for (const snapshot of snapshots.docs) {
                    const question: Question = snapshot.data();

                    if (question.categoryIds.length > 0) {
                        questionDict[question.id] = question.categoryIds;
                    }
                }
                return questionDict;

            }
        } catch (err) {
            console.log('err', err);
            throw err;
        }

    }


    private getGameQuestionCategories(game: Game, questionDict: { [key: string]: Array<number> }): Array<number> {
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

    private calculateAllGameUsersStat(userId: string, game: Game, categoryIds: Array<number>): void {
        const account: Account = (this.accountDict[userId]) ? this.accountDict[userId] : new Account();
        this.accountDict[userId] = leaderBoardAccountService.calcualteAccountStat(account, game, categoryIds, userId);
    }


    public async  getGameUsers(game: Game): Promise<any> {
        const userPromises = [];
        const questionPromises = [];
        const categoryIds = [];

        for (const playerQnA of game.playerQnAs) {
            questionPromises.push(QuestionService.getQuestionById(playerQnA.questionId));
        }

        try {

            const questionResults = await Promise.all(questionPromises);

            for (const questionResult of questionResults) {
                if (questionResult) {
                    const question = Question.getViewModelFromDb(questionResult.data());
                    for (const categoryId of question.categoryIds) {
                        if (categoryId && categoryIds.indexOf(categoryId) === -1) {
                            categoryIds.push(categoryId);
                        }
                    }
                }
            }

            for (const userId of Object.keys(game.stats)) {
                userPromises.push(this.calculateUserStat(userId, game, categoryIds));
            }

            const userResults = await Promise.all(userPromises);
            return userResults;
        } catch (err) {
            console.log('err', err);
            throw err;
        }

    }

    private async  calculateUserStat(userId: string, game: Game, categoryIds: Array<number>): Promise<string> {
        try {
            const accountData = await leaderBoardAccountService.getAccountById(userId);
            const account: Account = accountData.data();
            if (account && account.id) {
                const updateStatus = await leaderBoardAccountService.updateAccountData(
                    leaderBoardAccountService.calcualteAccountStat(account, game, categoryIds, userId));
                return updateStatus;
            }
        } catch (err) {
            console.log('err', err);
            throw err;
        }

    }


    public async calculateGameLeaderBoardStat(): Promise<string> {
        try {
            const accounts = await leaderBoardAccountService.getAccounts();
            let lbsStats = await leaderBoardService.getLeaderBoardStats();
            lbsStats = (lbsStats.data()) ? lbsStats.data() : {};
            console.log('lbsStats', lbsStats);
            for (const account of accounts.docs) {
                const accountObj: Account = account.data();
                lbsStats = leaderBoardService.calculateLeaderBoardStats(accountObj, lbsStats);
            }

            const updateLBSStatResult = await leaderBoardService.setLeaderBoardStats({ ...lbsStats });
            return updateLBSStatResult;
        } catch (err) {
            console.log('err', err);
            return err;
        }

    }

}
