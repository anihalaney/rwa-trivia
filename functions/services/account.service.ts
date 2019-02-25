const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { Account, Game } from '../../projects/shared-library/src/lib/shared/model';


/**
 * getAccountById
 * return account
 */
exports.getAccountById = async (id: string): Promise<any> => {
    try {
        return await accountFireStoreClient.doc(`/accounts/${id}`).get();
    } catch (error) {
        console.error(error);
        return error;
    }

};


/**
 * setAccount
 * return ref
 */
exports.setAccount = (dbAccount: any): Promise<any> => {
    return accountFireStoreClient.doc(`/accounts/${dbAccount.id}`).set(dbAccount).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};

/**
 * updateAccount
 * return ref
 */
exports.updateAccount = async (dbAccount: any): Promise<any> => {
    try {
        return await accountFireStoreClient.doc(`/accounts/${dbAccount.id}`).update(dbAccount);
    } catch (error) {
        console.error(error);
        return error;
    }

};

/**
 * getAccounts
 * return accounts
 */
exports.getAccounts = async (): Promise<any> => {
    try {
        return await accountFireStoreClient.collection('accounts').get();
    } catch (error) {
        console.error(error);
        return error;
    }
};



/**
 * calcualteAccountStat
 * return account
 */
exports.calcualteAccountStat = (account: Account, game: Game, categoryIds: Array<number>, userId: string): Account => {
    const score = game.stats[userId].score;
    const avgAnsTime = game.stats[userId].avgAnsTime;
    // console.log('categoryIds', categoryIds);
    account = (account) ? account : new Account();
    categoryIds.map((id) => {
        account.leaderBoardStats = (account.leaderBoardStats) ? account.leaderBoardStats : {};
        account.leaderBoardStats[id] = (account.leaderBoardStats && account.leaderBoardStats[id]) ?
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

    return account;
};


