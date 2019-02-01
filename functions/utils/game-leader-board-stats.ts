const leaderBoardGameService = require('../services/game.service');
const leaderBoardUserService = require('../services/user.service');
const leaderBoardAccountService = require('../services/account.service');
const leaderBoardService = require('../services/leaderboard.service');

import {
    Game, User, Account,
    LeaderBoardUser, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';


export class GameLeaderBoardStats {


    generateGameStats(): Promise<any> {
        return leaderBoardGameService.getCompletedGames()
            .then(games => games.docs.map(game => Game.getViewModel(game.data())))
            .then(games => {
                const gamePromises = [];
                games.map(game => {
                    gamePromises.push(this.getGameUsers(game));
                });

                Promise.all(gamePromises)
                    .then((gameResults) => {
                        return gameResults;
                        // console.log('All game stats are updates', gameResults);
                    })
                    .catch((e) => {
                        //  console.log('game promise error', e);
                    });
            });


    }

    public getGameUsers(game: Game): Promise<any> {
        const userPromises = [];
        Object.keys(game.stats).map((userId) => {
            console.log('userId', userId);
            userPromises.push(this.calculateUserStat(userId, game, game.gameOptions.categoryIds));
        });

        return Promise.all(userPromises)
            .then((userResults) => {
                //  console.log('All Users stats are updated', userResults);
                return userResults;
            })
            .catch((e) => {
                //  console.log('game promise error', e);
            });

    }

    private calculateUserStat(userId: string, game: Game, categoryIds: number[]): Promise<string> {
        const score = game.stats[userId].score;
        const avgAnsTime = game.stats[userId].avgAnsTime;
        return leaderBoardAccountService.getAccountById(userId).then(accountData => {
            let account: Account = accountData.data();
            console.log('account', account);
            if (account && account.id) {
                categoryIds.map((id) => {
                    account = (account) ? account : new Account();
                    account.leaderBoardStats[id] = (account.leaderBoardStats[id]) ?
                        account.leaderBoardStats[id] + score : score;
                });
                account['leaderBoardStats'] = { ...account.leaderBoardStats };
                account.gamePlayed = (account.gamePlayed) ? account.gamePlayed + 1 : 1;
                account.categories = Object.keys(account.leaderBoardStats).length;
                if (game.winnerPlayerId) {
                    (game.winnerPlayerId === userId) ?
                        account.wins = (account.wins) ? account.wins + 1 : 1 :
                        account.losses = (account.losses) ? account.losses + 1 : 1;
                }
                account.badges = (account.badges) ? account.badges + score : score;
                account.avgAnsTime = (account.avgAnsTime) ? Math.floor((account.avgAnsTime + avgAnsTime) / 2) : avgAnsTime;
                console.log('account', account);
                return this.updateAccount({ ...account }).then((id) => {
                    return `Account ${userId} Stat updated`;
                });
            } else {
                return `Account ${userId} Stat updated`;
            }
        });
    }

    private updateAccount(dbAccount: any): Promise<string> {
        return leaderBoardAccountService.setAccount(dbAccount).then(ref => {
            return dbAccount.id;
        });
    }


    public calculateGameLeaderBoardStat(): Promise<string> {

        return leaderBoardAccountService.getAccounts().then(accounts => {
            this.getLeaderBoardStat().then((lbsStats) => {
                accounts.docs.map(account => {
                    const accountObj: Account = account.data();
                    //   console.log('userId', accountObj.id);
                    lbsStats = this.calculateLeaderBoardStat(accountObj, lbsStats);
                    //   console.log('lbsStats', lbsStats);
                });
                return this.updateLeaderBoard({ ...lbsStats }).then((leaderBoardStat) => {
                    return leaderBoardStat;
                });
            });
        });

    }

    public getLeaderBoardStat(): Promise<{ [key: string]: Array<LeaderBoardUser> }> {
        return leaderBoardService.getLeaderBoardStats().then(lbs => (lbs.data()) ? lbs.data() : {});
    }

    public calculateLeaderBoardStat(accountObj: Account, lbsStats: { [key: string]: Array<LeaderBoardUser> })
        : { [key: string]: Array<LeaderBoardUser> } {
        if (accountObj && accountObj.id) {
            const leaderBoardStats = accountObj.leaderBoardStats;

            if (leaderBoardStats) {
                Object.keys(leaderBoardStats).map((id) => {
                    const leaderBoardUsers: Array<LeaderBoardUser> = (lbsStats[id]) ? lbsStats[id] : [];
                    const filteredUsers: Array<LeaderBoardUser> =
                        leaderBoardUsers.filter((lbUser) => lbUser.userId === accountObj.id);
                    //  console.log('filteredUsers', filteredUsers);

                    const leaderBoardUser: LeaderBoardUser = (filteredUsers.length > 0) ?
                        filteredUsers[0] : new LeaderBoardUser();
                    leaderBoardUser.userId = accountObj.id;
                    leaderBoardUser.score = leaderBoardStats[id];
                    const leaderBoardUserObj = { ...leaderBoardUser };
                    (filteredUsers.length > 0) ?
                        leaderBoardUsers[leaderBoardUsers.findIndex((fUser) => fUser.userId === accountObj.id)] = leaderBoardUserObj
                        : leaderBoardUsers.push(leaderBoardUserObj);

                    leaderBoardUsers.sort((a, b) => {
                        return b.score - a.score;
                    });
                    //  console.log('leaderBoardUsers', leaderBoardUsers);
                    (leaderBoardUsers.length > UserStatConstants.maxUsers) ?
                        leaderBoardUsers.splice(leaderBoardUsers.length - 1, 1) : '';

                    lbsStats[id] = leaderBoardUsers;
                });
            }
        }
        return lbsStats;
    }

    public updateLeaderBoard(leaderBoardStat: any): Promise<string> {
        return leaderBoardService.setLeaderBoardStats(leaderBoardStat).then(ref => {
            return leaderBoardStat;
        });
    }

    public getAccountById(id: string): Promise<any> {
        return leaderBoardAccountService.getAccountById(id).then((account) => {
            return account.data();
        });
    }


}
