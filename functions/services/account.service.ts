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
exports.setAccount = async (dbAccount: any): Promise<any> => {
    try {
        return await accountFireStoreClient.doc(`/accounts/${dbAccount.id}`)
            .set(dbAccount);

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
 * updated account
 * return ref
 */
exports.updateAccount = async (userId): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();
            const timestamp = utils.getUTCTimeStamp();
            if (docRef.exists) {
                const lives = docRef.data();
                if (lives.lives === maxLives || !lives.lastLiveUpdate) {
                    lives.lastLiveUpdate = timestamp;
                    lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                }
                if (lives.lives > 0) {
                    lives.lives += -1;
                }
                accountRef.update(lives);
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};


/**
 * incrase number of lives set in appSettings
 * return ref
 */
exports.increaseLives = async (userId): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesAdd = appSetting.lives.lives_add;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();
            const timestamp = utils.getUTCTimeStamp();
            if (docRef.exists) {
                const lives = docRef.data();
                if (lives.lives < maxLives && lives.nextLiveUpdate <= timestamp) {
                    lives.lives += livesAdd;
                    if (lives.lives > maxLives) {
                        lives.lives = maxLives;
                    } else {
                        lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                    }
                    lives.lastLiveUpdate = timestamp;
                    accountRef.update(lives);
                }
            } else {
                accountRef.set({ lives: maxLives, id: userId });
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * add default number of lives into account
 * return ref
 */
exports.addDefaultLives = async (user: any): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(user.id);
            const docRef = await accountRef.get();
            if (docRef.exists) {
                const lives = docRef.data();
                if (!lives.lives) {
                    lives.lives = maxLives;
                    lives.id = user.id;
                    accountRef.update(lives);
                }
            } else {
                accountRef.set({ lives: maxLives, id: user.id });
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * add number of lives into account(Schedular)
 * return ref
 */

exports.addLives = async (): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesAdd = appSetting.lives.lives_add;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            let timestamp = utils.getUTCTimeStamp();
            const accountCollRef = accountFireStoreClient.collection('accounts')
                .where('nextLiveUpdate', '<=', timestamp);
            const accounts = await accountCollRef.get();
            const accountsNotHavingMaxLives = accounts.docs.filter(d => d.data().lives < maxLives);
            for (const account of accountsNotHavingMaxLives) {
                timestamp = utils.getUTCTimeStamp();
                const userAccount = account.data();
                const accountRef = accountFireStoreClient.collection(`accounts`).doc(userAccount.id);
                const docRef = await accountRef.get();

                const lives = docRef.data();
                if (lives.lives < maxLives && lives.nextLiveUpdate <= timestamp) {
                    lives.lives += livesAdd;
                    if (lives.lives > maxLives) {
                        lives.lives = maxLives;
                    } else {
                        // Update nextLiveUpdate
                        lives.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                    }
                    lives.lastLiveUpdate = timestamp;
                    accountRef.update(lives);
                }
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

exports.updateLives = (userId): Promise<any> => {
    return this.increaseLives(userId);
};
