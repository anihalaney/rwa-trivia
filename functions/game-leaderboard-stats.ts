import { Game, GameStatus, GameOptions, PlayerMode, OpponentType, Stat, User, UserStats, LeaderBoardUser } from '../src/app/model';


export class GameLeaderBoardStats {


    private db: any

    constructor(private firebaseDB?: any) {

        this.db = firebaseDB;
    }


    generateGameStats() {
        this.db.collection('games')
            .where('gameOver', '==', true)
            .get().then(games => {
                const gameArr = [];
                games.forEach(game => {
                    gameArr.push(Game.getViewModel(game.data()))
                });
                this.getGameUsers(gameArr, 0).then((str) => { console.log(str) });
            });
    }


    private getGameUsers(games: Game[], index): Promise<string> {
        const game = games[index];
        const userIds = Object.keys(game.stats);
        return this.calculateUserStat(userIds, 0, game, game.gameOptions.categoryIds).then((status) => {
            index++;
            return (games.length > index) ? this.getGameUsers(games, index) : 'updated stats';
        });

    }

    public calculateUserStat(userIds: string[], index, game: Game, categoryIds: number[]): Promise<string> {
        const userId = userIds[index];
        const score = game.stats[userId].score;
        const avgAnsTime = game.stats[userId].avgAnsTime;
        return this.db.doc(`users/${userId}`)
            .get().then(userData => {
                const user: User = userData.data();
                if (user) {
                    categoryIds.forEach((id) => {
                        user.stats = (user.stats) ? user.stats : new UserStats();
                        user.stats.leaderBoardStats[id] = (user.stats.leaderBoardStats[id]) ?
                            user.stats.leaderBoardStats[id] + score : score;
                    });
                    user.stats['leaderBoardStats'] = { ...user.stats.leaderBoardStats };
                    user.stats.gamePlayed = (user.stats.gamePlayed) ? user.stats.gamePlayed + 1 : 1;
                    user.stats.topics = Object.keys(user.stats.leaderBoardStats).length;
                    (game.winnerPlayerId === userId) ?
                        user.stats.wins = (user.stats.wins) ? user.stats.wins + 1 : 1 :
                        user.stats.losses = (user.stats.losses) ? user.stats.losses + 1 : 1;
                    user.stats.badges = (user.stats.badges) ? user.stats.badges + score : score;
                    user.stats.avgAnsTime = (user.stats.avgAnsTime) ? Math.floor((user.stats.avgAnsTime + avgAnsTime) / 2) : avgAnsTime;
                    user['stats'] = { ...user.stats };
                    return this.updateUser({ ...user }).then((id) => {
                        index++;
                        return (userIds.length > index) ? this.calculateUserStat(userIds, index, game, categoryIds) : 'User Stat updated';
                    });
                } else {
                    index++;
                    return (userIds.length > index) ? this.calculateUserStat(userIds, index, game, categoryIds) : 'User Stat updated';
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
                    users.forEach(user => {
                        const userObj: User = user.data();
                     //   console.log('userId', userObj.userId);
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
                Object.keys(leaderBoardStats).forEach((id) => {
                    const leaderBoardUsers: Array<LeaderBoardUser> = (lbsStats[id]) ? lbsStats[id] : [];
                    const filteredUsers: Array<LeaderBoardUser> =
                        leaderBoardUsers.filter((lbUser) => lbUser.userId === userObj.userId);
                   // console.log('filteredUsers', filteredUsers);

                    const leaderBoardUser: LeaderBoardUser = (filteredUsers.length > 0) ?
                        filteredUsers[0] : new LeaderBoardUser();
                    leaderBoardUser.userId = userObj.userId;
                    leaderBoardUser.score = leaderBoardStats[id];
                    const leaderBoardUserObj = { ...leaderBoardUser };
                    (filteredUsers.length > 0) ?
                        leaderBoardUsers[filteredUsers.findIndex((fUser) => fUser.userId === userObj.userId)] = leaderBoardUserObj
                        : leaderBoardUsers.push(leaderBoardUserObj);

                    leaderBoardUsers.sort((a, b) => {
                        return b.score - a.score;
                    });
                   // console.log('leaderBoardUsers', leaderBoardUsers);
                    (leaderBoardUsers.length > 100) ?
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
