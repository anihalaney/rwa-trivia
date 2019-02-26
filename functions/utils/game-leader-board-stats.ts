const leaderBoardGameService = require('../services/game.service');
const leaderBoardQuestionService = require('../services/question.service');
const leaderBoardAccountService = require('../services/account.service');
const leaderBoardService = require('../services/leaderboard.service');

import {
    Game, Account, Question
} from '../../projects/shared-library/src/lib/shared/model';


export class GameLeaderBoardStats {

    accountDict: { [key: string]: Account };

    constructor() {
        this.accountDict = {};
    }

    public async generateGameStats(): Promise<any> {
        const userPromises = [];
        let games;
        try {
            games = await leaderBoardGameService.getCompletedGames();

            games = games.docs.map(game => Game.getViewModel(game.data()));

            const questionDict = await this.loadQuestionDictionary();

            games.map(game => {
                Object.keys(game.stats).map((userId) => {
                    this.calculateAllGameUsersStat(userId, game, this.getGameQuestionCategories(game, questionDict));
                });
            });

            Object.keys(this.accountDict).map((userId) => {
                const account: Account = this.accountDict[userId];
                account.id = userId;
                userPromises.push(leaderBoardAccountService.updateAccountData({ ...account }));
            });

            const userResults = await Promise.all(userPromises);
            this.accountDict = {};

            return Promise.resolve(userResults);
        } catch (err) {
            console.log('err', err);
        }
    }

    public async loadQuestionDictionary(): Promise<{ [key: string]: Array<number> }> {
        const questionDict: { [key: string]: Array<number> } = {};

        try {
            const snapshots = await leaderBoardQuestionService.getAllQuestions();
            if (snapshots.empty) {
                console.log('questions do not exist');
                return Promise.reject(snapshots);
            } else {
                snapshots.docs.map((snapshot) => {
                    const question: Question = snapshot.data();

                    if (question.categoryIds.length > 0) {
                        questionDict[question.id] = question.categoryIds;
                    }
                });
                return Promise.resolve(questionDict);

            }
        } catch (err) {
            console.log('err', err);
            return Promise.reject(err);
        }

    }


    private getGameQuestionCategories(game: Game, questionDict: { [key: string]: Array<number> }): Array<number> {
        const questionCategories: Array<number> = [];

        game.playerQnAs.map((playerQnA) => {
            const categoryIds: Array<number> = questionDict[playerQnA.questionId];
            if (categoryIds) {
                categoryIds.map((categoryId) => {
                    if (categoryId && questionCategories.indexOf(categoryId) === -1) {
                        questionCategories.push(categoryId);
                    }
                });
            }
        });

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

        game.playerQnAs.map((playerQnA) => {
            questionPromises.push(leaderBoardQuestionService.getQuestionById(playerQnA.questionId));
        });

        try {

            const questionResults = await Promise.all(questionPromises);

            questionResults.map((questionResult) => {
                if (questionResult) {
                    const question = Question.getViewModelFromDb(questionResult.data());
                    question.categoryIds.map((categoryId) => {
                        if (categoryId && categoryIds.indexOf(categoryId) === -1) {
                            categoryIds.push(categoryId);
                        }
                    });
                }
            });

            Object.keys(game.stats).map((userId) => {
                userPromises.push(this.calculateUserStat(userId, game, categoryIds));
            });

            const userResults = await Promise.all(userPromises);
            return Promise.resolve(userResults);
        } catch (err) {
            console.log('err', err);
            return Promise.reject(err);
        }

    }

    private async  calculateUserStat(userId: string, game: Game, categoryIds: Array<number>): Promise<string> {
        try {
            const accountData = await leaderBoardAccountService.getAccountById(userId);
            const account: Account = accountData.data();
            if (account && account.id) {
                const updateStatus = await leaderBoardAccountService.updateAccountData(
                    leaderBoardAccountService.calcualteAccountStat(account, game, categoryIds, userId));
                return Promise.resolve(updateStatus);
            }
        } catch (err) {
            console.log('err', err);
            return Promise.reject(err);
        }

    }


    public async calculateGameLeaderBoardStat(): Promise<string> {
        try {
            const accounts = await leaderBoardAccountService.getAccounts();
            let lbsStats = await leaderBoardService.getLeaderBoardStats();
            lbsStats = (lbsStats.data()) ? lbsStats.data() : {};
            console.log('lbsStats', lbsStats);
            accounts.docs.map(account => {
                const accountObj: Account = account.data();
                lbsStats = leaderBoardService.calculateLeaderBoardStats(accountObj, lbsStats);
            });

            const updateLBSStatResult = await leaderBoardService.setLeaderBoardStats({ ...lbsStats });
            return Promise.resolve(updateLBSStatResult);
        } catch (err) {
            console.log('err', err);
            return Promise.reject(err);
        }

    }

}
