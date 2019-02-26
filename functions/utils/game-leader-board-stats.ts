const leaderBoardGameService = require('../services/game.service');
const leaderBoardQuestionService = require('../services/question.service');
const leaderBoardAccountService = require('../services/account.service');
const leaderBoardService = require('../services/leaderboard.service');

import {
    Game, Account,
    LeaderBoardUser, Question
} from '../../projects/shared-library/src/lib/shared/model';


export class GameLeaderBoardStats {

    accountDict: { [key: string]: Account };

    constructor() {
        this.accountDict = {};
    }

    public async generateGameStats(): Promise<any> {
        const userPromises = [];
        return leaderBoardGameService.getCompletedGames()
            .then(games => games.docs.map(game => Game.getViewModel(game.data())))
            .then(games => {
                this.loadQuestionDictionary().then(questionDict => {

                    games.map(game => {
                        Object.keys(game.stats).map((userId) => {
                            this.calculateAllGameUsersStat(userId, game, this.getGameQuestionCategories(game, questionDict));
                        });
                    });



                    Object.keys(this.accountDict).map((userId) => {
                        const account: Account = this.accountDict[userId];
                        account.id = userId;
                        userPromises.push(this.updateAccount({ ...account }));
                    });

                    Promise.all(userPromises)
                        .then((userResults) => {
                            this.accountDict = {};
                            return userResults;
                        })
                        .catch((e) => {
                            console.log('user update promise error', e);
                        });
                }).catch((e) => {
                    console.log('user update promise error', e);
                });

            });
    }

    public async loadQuestionDictionary(): Promise<{ [key: string]: Array<number> }> {
        const questionDict: { [key: string]: Array<number> } = {};
        return leaderBoardQuestionService.getAllQuestions()
            .then(snapshots => {

                if (snapshots.empty) {
                    console.log('questions do not exist');
                } else {
                    snapshots.docs.map((snapshot) => {
                        const question: Question = snapshot.data();

                        if (question.categoryIds.length > 0) {
                            questionDict[question.id] = question.categoryIds;
                        }
                    });
                    return questionDict;

                }
            }).catch(error => {
                console.log('error', error);
            });
    }

    private calculateAllGameUsersStat(userId: string, game: Game, categoryIds: Array<number>): void {
        const account: Account = (this.accountDict[userId]) ? this.accountDict[userId] : new Account();
        this.accountDict[userId] = leaderBoardAccountService.calcualteAccountStat(account, game, categoryIds, userId);
    }


    public async  getGameUsers(game: Game, questionDict: { [key: string]: Array<number> }): Promise<any> {
        const userPromises = [];

        Object.keys(game.stats).map((userId) => {
            userPromises.push(this.calculateUserStat(userId, game, this.getGameQuestionCategories(game, questionDict)));
        });

        return Promise.all(userPromises)
            .then((userResults) => {
                // console.log('All Users stats are updated', userResults);
                return userResults;
            })
            .catch((e) => {
                console.log('game promise error', e);
            });

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


    private async  calculateUserStat(userId: string, game: Game, categoryIds: Array<number>): Promise<string> {

        return leaderBoardAccountService.getAccountById(userId).then(accountData => {
            const account: Account = accountData.data();
            if (account && account.id) {
                const dbAccount = leaderBoardAccountService.calcualteAccountStat(account, game, categoryIds, userId);
                return this.updateAccount({ ...dbAccount }).then((id) => {
                    return `Account ${userId} Stat updated`;
                }, error => error);
            } else {
                return `Account ${userId} Stat updated`;
            }
        }, error => error);


    }


    private async updateAccount(dbAccount: any): Promise<string> {
        return leaderBoardAccountService.updateAccountData(dbAccount).then(ref => {
            return dbAccount.id;
        });
    }


    public async calculateGameLeaderBoardStat(): Promise<string> {

        return leaderBoardAccountService.getAccounts().then(accounts => {
            this.getLeaderBoardStat().then((lbsStats) => {
                console.log('lbsStats', lbsStats);
                accounts.docs.map(account => {
                    const accountObj: Account = account.data();
                    lbsStats = this.calculateLeaderBoardStat(accountObj, lbsStats);
                });
                return this.updateLeaderBoard({ ...lbsStats }).then((leaderBoardStat) => {
                    return leaderBoardStat;
                }, error => error);
            });
        }, error => error);

    }

    public getLeaderBoardStat(): Promise<{ [key: string]: Array<LeaderBoardUser> }> {
        return leaderBoardService.getLeaderBoardStats().then(lbs => (lbs.data()) ? lbs.data() : {});
    }

    public calculateLeaderBoardStat(accountObj: Account, lbsStats: { [key: string]: Array<LeaderBoardUser> })
        : { [key: string]: Array<LeaderBoardUser> } {
        return leaderBoardService.calculateLeaderBoardStats(accountObj, lbsStats);
    }

    public async updateLeaderBoard(leaderBoardStat: any): Promise<string> {
        return leaderBoardService.setLeaderBoardStats(leaderBoardStat).then(ref => {
            return leaderBoardStat;
        }, error => error);
    }

    public getAccountById(id: string): Promise<any> {
        return leaderBoardAccountService.getAccountById(id).then((account) => {
            return account.data();
        });
    }


}
