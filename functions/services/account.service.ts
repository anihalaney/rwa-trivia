const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { Utils } from '../utils/utils';
import { Account } from '../../projects/shared-library/src/lib/shared/model';
const utils: Utils = new Utils();


/**
 * getAccountById
 * return account
 */
exports.getAccountById = (id: string): Promise<any> => {
    return accountFireStoreClient.doc(`/accounts/${id}`)
        .get()
        .then(u => { return u })
        .catch(error => {
            console.error(error);
            return error;
        });
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
 * getAccounts
 * return accounts
 */
exports.getAccounts = (): Promise<any> => {
    return accountFireStoreClient.collection('accounts')
        .get().then(accounts => { return accounts })
        .catch(error => {
            console.error(error);
            return error;
        });
};

exports.updateAccount = (userId): Promise<any> => {
    const docRef = accountFireStoreClient.collection(`accounts`).doc(userId);

    return docRef.get()
        .then(ref => {
            const timestamp = utils.getUTCTimeStamp();
            if (ref.exists) {
                const lives = ref.data();
                if (lives.lives === 4 || !lives.lastLiveUpdate) {
                    lives.lastLiveUpdate = timestamp;
                    lives.nextLiveUpdate = utils.addMinutes(timestamp, 32);
                }
                if (lives.lives > 0) {
                    lives.lives += -1;
                }
                docRef.update(lives);
            }
        }).catch(function (error) {
            console.log(error.message);
        });
};



exports.increaseLives = (userId): Promise<any> => {
    const docRef = accountFireStoreClient.collection(`accounts`).doc(userId);

    return docRef.get()
        .then(ref => {
            const timestamp = utils.getUTCTimeStamp();
            if (ref.exists) {
                const lives = ref.data();
                if (lives.lives < 4) {
                    lives.lives += 2;
                    if (lives.lives > 4) {
                        lives.lives = 4;
                    } else {
                        lives.nextLiveUpdate = utils.addMinutes(timestamp, 32);
                    }
                    lives.lastLiveUpdate = timestamp;
                    docRef.update(lives);
                }

            } else {
                docRef.set({ lives: 4, livesCreateAt: timestamp });
            }
        }).catch(function (error) {
            console.log(error.message);
        });
};


exports.addDefaultLives = (user: any): Promise<any> => {

    const docRef = accountFireStoreClient.doc(`/accounts/${user.id}`);
    return docRef.get()
        .then(ref => {
            if (ref.exists) {
                const lives = ref.data();
                if (!lives.lives) {
                    lives.lives = 4;
                    docRef.update(lives);
                }
            } else {
                docRef.set({ lives: 4 });
            }
            return docRef;
        }).catch(function (error) {
            console.log(error.message);
        });
};

exports.addLives = (): Promise<any> => {
    let timestamp = utils.getUTCTimeStamp();
    return accountFireStoreClient.collection('accounts')
        .where('nextLiveUpdate', '<=', timestamp)
        .get()
        .then(accounts => {
            accounts = accounts.docs.filter(d => d.data().lives < 4);
            accounts.map(account => {
                timestamp = utils.getUTCTimeStamp();
                const userAccount = account.data();
                const docRef = accountFireStoreClient.collection(`accounts`).doc(userAccount.id); // .doc(`/accounts/${userAccount.id}`);
                docRef.get()
                    .then(ref => {
                        const lives = ref.data();
                        if (lives.lives < 4 && lives.nextLiveUpdate <= timestamp) {
                            lives.lives += 2;
                            if (lives.lives > 4) {
                                lives.lives = 4;
                            } else {
                                lives.nextLiveUpdate = utils.addMinutes(timestamp, 32);
                            }
                            lives.lastLiveUpdate = timestamp;
                            docRef.update(lives);
                        }
                    }).catch(function (error) {
                        console.log(error.message);
                    });
            });
            return accounts;
        });
};

exports.updateLives = (userId): Promise<any> => {
    return this.increaseLives(userId).then(account => {
        return account;
    });
};

exports.insertLivesCreate = (userId): Promise<any> => {
    const accountObj: any = {};
    accountObj.id = userId;
    accountObj.lives = 4;
    return this.setAccount(accountObj);
};
