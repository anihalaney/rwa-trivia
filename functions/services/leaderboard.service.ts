import {
    Account, CollectionConstants, LeaderBoardUsers, UserStatConstants, LeaderBoardUser
} from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import * as stringHash from 'string-hash';

export class LeaderBoardService {

    private static leaderBoardFireStoreClient = admin.firestore();

    /**
     * setLeaderBoardStatsById
     * return any
     */
    static async setLeaderBoardStatsById(id: any, leaderBoardStat: any): Promise<any> {
        try {
            return await LeaderBoardService.leaderBoardFireStoreClient
                .doc(`/${CollectionConstants.LEADER_BOARD_STATS}/${id}/stat/${leaderBoardStat.userId}`)
                .set(leaderBoardStat);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getAllCategories
     * return category
     */
    static async getAllCategories(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await LeaderBoardService.leaderBoardFireStoreClient
                    .collection(CollectionConstants.CATEGORIES).get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * setLeaderBoardStatsData
     * return any
     */
    static async setLeaderBoardStatsData(id: any, idHash: any): Promise<any> {
        try {
            return await LeaderBoardService.leaderBoardFireStoreClient
                .doc(`/${CollectionConstants.LEADER_BOARD_STATS}/${idHash}`)
                .set({id: id});
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
    * getLeaderBoardStats
    * return any
    */
    static async getLeaderBoardStats(): Promise<any> {
        try {
            return LeaderBoardService.getLeaderBoardDict(
                await LeaderBoardService.leaderBoardFireStoreClient
                    .collection(CollectionConstants.LEADER_BOARD_STATS).get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
    * getLeaderBoardDict
    * return leaderBoardDicts
    */
    static getLeaderBoardDict(snapshots: any): { [key: string]: LeaderBoardUser[] } {

        const leaderBoardDicts: { [key: string]: LeaderBoardUser[] } = {};

        for (const snapshot of snapshots.docs) {
            leaderBoardDicts[snapshot.id] = snapshot.data();
        }
        return leaderBoardDicts;
    }

    /**
     * calculateLeaderBoardStats
     * return any
     */
    static calculateLeaderBoardStats(accountObj: Account, leaderBoardDict: { [key: string]: LeaderBoardUsers })
        : { [key: string]: LeaderBoardUsers } {

        if (accountObj && accountObj.id) {
            const leaderBoardStats = accountObj.leaderBoardStats;

            if (leaderBoardStats) {
                for (const id of Object.keys(leaderBoardStats)) {

                    let userIndex = -1;
                    const leaderBoardUsers = leaderBoardDict[id] ? new LeaderBoardUsers(leaderBoardDict[id]) : new LeaderBoardUsers({});

                    userIndex = leaderBoardUsers.users.findIndex((lUser) => lUser.userId === accountObj.id);

                    const leaderBoardUserData = (userIndex === -1) ? new LeaderBoardUser() : leaderBoardUsers.users[userIndex];

                    leaderBoardUserData.userId = accountObj.id;
                    leaderBoardUserData.score = leaderBoardStats[id];

                    (userIndex === -1) ? leaderBoardUsers.users.push({ ...leaderBoardUserData }) :
                        leaderBoardUsers.users[userIndex] = leaderBoardUserData;

                    leaderBoardDict[id] = leaderBoardUsers;

                }
            }
        }
        return leaderBoardDict;
    }

    static async setLeaderBoardStatForSingleUser(accountObj: Account): Promise<any> {
        try {

            const promises = [];
            if (accountObj && accountObj.id) {
                const leaderBoardStats = accountObj.leaderBoardStats;
                if (leaderBoardStats) {
                    const category = await LeaderBoardService.getAllCategories();
                    const categoryIds = [];
                    for (const data of category) {
                        categoryIds.push(data.id.toString(10));
                    }
                    for (const id of Object.keys(leaderBoardStats)) {
                        let idHash = id;
                        if (categoryIds.indexOf(id) < 0) {
                           idHash = await stringHash(id);
                        }
                        promises.push(LeaderBoardService.setLeaderBoardStatsById(idHash,
                        { ...{userId: accountObj.id, score: leaderBoardStats[id]} }));
                    }
                }
            }

           return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
