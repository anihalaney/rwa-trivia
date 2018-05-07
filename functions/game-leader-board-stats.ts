import {
    Game, GameStatus, GameOptions, PlayerMode, OpponentType, Stat, User, UserStats,
    LeaderBoardUser, UserStatConstants
} from '../src/app/model';


export class GameLeaderBoardStats {


    private db: any

    constructor(private firebaseDB?: any) {

        this.db = firebaseDB;
    }


    generateGameStats() {
        this.db.collection('games')
            .where('gameOver', '==', true)
            .get()
            .then(games => games.docs.map(game => Game.getViewModel(game.data())))
            .then(games => {
                const gamePromises = [];
                games.map(game => {
                    gamePromises.push(this.getGameUsers(game));
                });

                Promise.all(gamePromises)
                    .then((gameResults) => {
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
        return this.db.doc(`users/${userId}`)
            .get().then(userData => {
                const user: User = userData.data();
                if (user && user.userId) {
                    categoryIds.map((id) => {
                        user.stats = (user.stats) ? user.stats : new UserStats();
                        user.stats.leaderBoardStats[id] = (user.stats.leaderBoardStats[id]) ?
                            user.stats.leaderBoardStats[id] + score : score;
                    });
                    user.stats['leaderBoardStats'] = { ...user.stats.leaderBoardStats };
                    user.stats.gamePlayed = (user.stats.gamePlayed) ? user.stats.gamePlayed + 1 : 1;
                    user.stats.categories = Object.keys(user.stats.leaderBoardStats).length;
                    (game.winnerPlayerId === userId) ?
                        user.stats.wins = (user.stats.wins) ? user.stats.wins + 1 : 1 :
                        user.stats.losses = (user.stats.losses) ? user.stats.losses + 1 : 1;
                    user.stats.badges = (user.stats.badges) ? user.stats.badges + score : score;
                    user.stats.avgAnsTime = (user.stats.avgAnsTime) ? Math.floor((user.stats.avgAnsTime + avgAnsTime) / 2) : avgAnsTime;
                    user['stats'] = { ...user.stats };
                    return this.updateUser({ ...user }).then((id) => {
                        return `User ${userId} Stat updated`;
                    });
                } else {
                    return `User ${userId} Stat updated`;
                }
            });
    }

    private updateUser(dbUser: any): Promise<string> {
        return this.db.doc('/users/' + dbUser.userId).set(dbUser).then(ref => {
            return dbUser.userId;
        });
    }


    public calculateGameLeaderBoardStat(): Promise<string> {

        return this.db.collection('users')
            .get().then(users => {
                this.getLeaderBoardStat().then((lbsStats) => {
                    users.docs.map(user => {
                        const userObj: User = user.data();
                      //  console.log('userId', userObj.userId);
                        lbsStats = this.calculateLeaderBoardStat(userObj, lbsStats);
                      //  console.log('lbsStats', lbsStats);
                    });
                    return this.updateLeaderBoard({ ...lbsStats }).then((leaderBoardStat) => {
                        return leaderBoardStat;
                    });
                });
            });

    }

    public getLeaderBoardStat(): Promise<{ [key: string]: Array<LeaderBoardUser> }> {
        return this.db.doc('leader_board_stats/categories')
            .get().then(lbs => (lbs.data()) ? lbs.data() : {});
    }

    public calculateLeaderBoardStat(userObj: User, lbsStats: { [key: string]: Array<LeaderBoardUser> })
        : { [key: string]: Array<LeaderBoardUser> } {
        if (userObj && userObj.userId && userObj.stats) {
            const leaderBoardStats = userObj.stats.leaderBoardStats;

            if (leaderBoardStats) {
                Object.keys(leaderBoardStats).map((id) => {
                    const leaderBoardUsers: Array<LeaderBoardUser> = (lbsStats[id]) ? lbsStats[id] : [];
                    const filteredUsers: Array<LeaderBoardUser> =
                        leaderBoardUsers.filter((lbUser) => lbUser.userId === userObj.userId);
                  //  console.log('filteredUsers', filteredUsers);

                    const leaderBoardUser: LeaderBoardUser = (filteredUsers.length > 0) ?
                        filteredUsers[0] : new LeaderBoardUser();
                    leaderBoardUser.userId = userObj.userId;
                    leaderBoardUser.score = leaderBoardStats[id];
                    const leaderBoardUserObj = { ...leaderBoardUser };
                    (filteredUsers.length > 0) ?
                        leaderBoardUsers[leaderBoardUsers.findIndex((fUser) => fUser.userId === userObj.userId)] = leaderBoardUserObj
                        : leaderBoardUsers.push(leaderBoardUserObj);

                    leaderBoardUsers.sort((a, b) => {
                        return b.score - a.score;
                    });
                 //   console.log('leaderBoardUsers', leaderBoardUsers);
                    (leaderBoardUsers.length > UserStatConstants.maxUsers) ?
                        leaderBoardUsers.splice(leaderBoardUsers.length - 1, 1) : '';

                    lbsStats[id] = leaderBoardUsers;
                });
            }
        }
        return lbsStats;
    }

    public updateLeaderBoard(leaderBoardStat: any): Promise<string> {
        return this.db.doc('/leader_board_stats/categories').set(leaderBoardStat).then(ref => {
            return leaderBoardStat;
        });
    }


}
