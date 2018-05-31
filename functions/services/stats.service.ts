const statsFireBaseClient = require('../db/firebase-client');
const statsFireStoreClient = statsFireBaseClient.firestore();

/**
 * getSystemStats
 * return systemstat
 */
exports.getSystemStats = (statName: string): Promise<any> => {
    return statsFireStoreClient.doc(`stats/${statName}`)
        .get().then(ss => { return ss })
        .catch(error => {
            console.error(error);
            return error;
        });
};


/**
 * setSystemStats
 * return ref
 */
exports.setSystemStats = (statName: string, SystemStat: any): Promise<any> => {
    return statsFireStoreClient.doc(`stats/${statName}`).set(SystemStat).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};

