import { LeaderBoardUser, Account, UserStatConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';

export class LeaderBoardService {

    private static leaderBoardFireStoreClient = admin.firestore();

    /**
     * getLeaderBoardStats
     * return leaderoardstat
     */
    static async getLeaderBoardStats(): Promise<any> {
        try {
            return await this.leaderBoardFireStoreClient.doc('leader_board_stats/categories').get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setLeaderBoardStats
     * return ref
     */
    static async setLeaderBoardStats(leaderBoardStat: any): Promise<any> {
        try {
            return await this.leaderBoardFireStoreClient.doc('/leader_board_stats/categories').set(leaderBoardStat);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    /**
     * calculateLeaderBoardStats
     * return lbsstat
     */
    static calculateLeaderBoardStats(accountObj: Account, lbsStats: { [key: string]: Array<LeaderBoardUser> })
        : { [key: string]: Array<LeaderBoardUser> } {

        if (accountObj && accountObj.id) {
            const leaderBoardStats = accountObj.leaderBoardStats;

            if (leaderBoardStats) {
                for (const id of Object.keys(leaderBoardStats)) {
                    const leaderBoardUsers: Array<LeaderBoardUser> = (lbsStats[id]) ? lbsStats[id] : [];
                    const filteredUsers: Array<LeaderBoardUser> =
                        leaderBoardUsers.filter((lbUser) => lbUser.userId === accountObj.id);

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
                    if (leaderBoardUsers.length > UserStatConstants.maxUsers) {
                        leaderBoardUsers.splice(leaderBoardUsers.length - 1, 1);
                    }
                    lbsStats[id] = leaderBoardUsers;
                }
            }
        }
        return lbsStats;
    }
}
