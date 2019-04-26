import {
    LeaderBoardUser, Account, UserStatConstants, CollectionConstants, GeneralConstants
} from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class LeaderBoardService {

    private static leaderBoardFireStoreClient = admin.firestore();

    /**
     * getLeaderBoardStats
     * return leaderoardstat
     */
    static async getLeaderBoardStats(): Promise<any> {
        try {
            const lbsStats = await LeaderBoardService.leaderBoardFireStoreClient.
                doc(CollectionConstants.LEADER_BOARD_STATS_FORWARD_SLASH_CATEGORIES).
                get();
            return (lbsStats.data()) ? lbsStats.data() : {};
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setLeaderBoardStats
     * return ref
     */
    static async setLeaderBoardStats(leaderBoardStat: any): Promise<any> {
        try {
            return await LeaderBoardService.leaderBoardFireStoreClient
                .doc(`/${CollectionConstants.LEADER_BOARD_STATS_FORWARD_SLASH_CATEGORIES}`)
                .set(leaderBoardStat, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
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
