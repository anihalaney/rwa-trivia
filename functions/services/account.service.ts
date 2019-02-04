const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { AppSettings } from './app-settings.service';
import { Utils } from '../utils/utils';
const utils: Utils = new Utils();
const appSettings: AppSettings = new AppSettings();

/**
 * getAccountById
 * return account
 */
exports.getAccountById = (id: string): Promise<any> => {
    return accountFireStoreClient.doc(`/accounts/${id}`)
        .get()
        .then(u => u)
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
        .get().then(accounts => accounts)
        .catch(error => {
            console.error(error);
            return error;
        });
};

exports.updateAccount = (userId): Promise<any> => {
    return appSettings.getAppSettings().then(appSetting => {
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            const docRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            return docRef.get()
                .then(ref => {
                    const timestamp = utils.getUTCTimeStamp();
                    if (ref.exists) {
                        const lives = ref.data();
                        if (lives.lives === maxLives || !lives.lastLiveUpdate) {
                            lives.lastLiveUpdate = timestamp;
                            lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                        }
                        if (lives.lives > 0) {
                            lives.lives += -1;
                        }
                        docRef.update(lives);
                    }
                }).catch(function (error) {
                    console.log(error.message);
                });
        }
    });
};



exports.increaseLives = (userId): Promise<any> => {
    return appSettings.getAppSettings().then(appSetting => {
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesAdd = appSetting.lives.lives_add;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            const docRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            return docRef.get()
                .then(ref => {
                    const timestamp = utils.getUTCTimeStamp();
                    if (ref.exists) {
                        const lives = ref.data();
                        if (lives.lives < maxLives) {
                            lives.lives += livesAdd;
                            if (lives.lives > maxLives) {
                                lives.lives = maxLives;
                            } else {
                                lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                            }
                            lives.lastLiveUpdate = timestamp;
                            docRef.update(lives);
                        }

                    } else {
                        docRef.set({ lives: maxLives });
                    }
                }).catch(function (error) {
                    console.log(error.message);
                });
        }
    });

};


exports.addDefaultLives = (user: any): Promise<any> => {
    return appSettings.getAppSettings().then(appSetting => {
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const docRef = accountFireStoreClient.doc(`/accounts/${user.id}`);
            return docRef.get()
                .then(ref => {
                    if (ref.exists) {
                        const lives = ref.data();
                        if (!lives.lives) {
                            lives.lives = maxLives;
                            docRef.update(lives);
                        }
                    } else {
                        docRef.set({ lives: maxLives });
                    }
                    return docRef;
                }).catch(function (error) {
                    console.log(error.message);
                });
        }
    });
};

exports.addLives = (): Promise<any> => {

    return appSettings.getAppSettings().then(appSetting => {
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesAdd = appSetting.lives.lives_add;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            let timestamp = utils.getUTCTimeStamp();
            return accountFireStoreClient.collection('accounts')
                .where('nextLiveUpdate', '<=', timestamp)
                .get()
                .then(accounts => {
                    accounts = accounts.docs.filter(d => d.data().lives < 4);
                    accounts.map(account => {
                        timestamp = utils.getUTCTimeStamp();
                        const userAccount = account.data();
                        const docRef = accountFireStoreClient.collection(`accounts`).doc(userAccount.id);
                        docRef.get()
                            .then(ref => {
                                const lives = ref.data();
                                if (lives.lives < maxLives && lives.nextLiveUpdate <= timestamp) {
                                    lives.lives += livesAdd;
                                    if (lives.lives > maxLives) {
                                        lives.lives = maxLives;
                                    } else {
                                        lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
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
        }
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
