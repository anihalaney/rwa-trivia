const leaderBoardFireBaseClient = require('../db/firebase-client');
const leaderBoardFireStoreClient = leaderBoardFireBaseClient.firestore();

/**
 * getLeaderBoardStats
 * return leaderoardstat
 */
exports.getLeaderBoardStats = (userId: string): Promise<any> => {
    return leaderBoardFireStoreClient.doc('leader_board_stats/categories')
        .get().then(lbs => { return lbs })
        .catch(error => {
            console.error(error);
            return error;
        });
};


/**
 * setLeaderBoardStats
 * return ref
 */
exports.setLeaderBoardStats = (leaderBoardStat: any): Promise<any> => {
    return leaderBoardFireStoreClient.doc('/leader_board_stats/categories').set(leaderBoardStat).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};

