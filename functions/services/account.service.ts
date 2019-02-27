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
 * decrease life
 * return ref
 */
exports.decreaseLife = async (userId): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.lives.enable) {
            const maxLives = appSetting.lives.max_lives;
            const livesMillis = appSetting.lives.lives_after_add_millisecond;
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();
            const timestamp = utils.getUTCTimeStamp();
            if (docRef.exists) {
                const account = docRef.data();
                if (account.lives === maxLives || !account.lastLiveUpdate) {
                    account.lastLiveUpdate = timestamp;
                    account.nextLiveUpdate = utils.addMinutes(timestamp, livesMillis);
                }
                if (account.lives > 0) {
                    account.lives += -1;
                }
                accountRef.update(account);
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
            await this.addLife(userId, appSetting);
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
                const account = docRef.data();
                if (!account.lives) {
                    account.lives = maxLives;
                    account.id = user.id;
                    accountRef.update(account);
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
            let timestamp = utils.getUTCTimeStamp();
            const accountCollRef = accountFireStoreClient.collection('accounts')
                .where('nextLiveUpdate', '<=', timestamp);
            const accounts = await accountCollRef.get();
            const accountsNotHavingMaxLives = accounts.docs.filter(d => d.data().lives < maxLives);
            for (const account of accountsNotHavingMaxLives) {
                timestamp = utils.getUTCTimeStamp();
                const userAccount = account.data();
                await this.addLife(userAccount.id, appSetting);
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

// add life to account
exports.addLife = async (userId: String, appSetting): Promise<any> => {
    try {
        const timestamp = utils.getUTCTimeStamp();
        const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
        const docRef = await accountRef.get();
        const account = docRef.data();
        if (docRef.exists) {
            if (account.lives < appSetting.lives.maxLives && account.nextLiveUpdate <= timestamp) {
                account.lives += appSetting.lives.livesAdd;
                if (account.lives > appSetting.lives.maxLives) {
                    account.lives = appSetting.lives.maxLives;
                } else {
                    // Update nextLiveUpdate
                    account.nextLiveUpdate = utils.addMinutes(timestamp, appSetting.lives.livesMillis);
                }
                account.lastLiveUpdate = timestamp;
                accountRef.update(account);
            }
        } else {
            accountRef.set({ lives: appSetting.lives.maxLives, id: userId });
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

exports.updateLives = (userId): Promise<any> => {
    return this.increaseLives(userId);
};

/**
 * set number of bits into account
 */
exports.setBits = async (userId: any): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.tokens.enable) {
            const bits = appSetting.tokens.earn_bits;
            console.log('not bits', bits);
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();

            if (docRef.exists) {
                const account = docRef.data();
                account.bits = (account.bits) ? (account.bits + bits) : bits;
                account.id = userId;
                accountRef.update(account);
            } else {
                accountRef.set({ bits: bits, id: userId });
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * set number of bits into account
 */
exports.setBytes = async (userId: any): Promise<any> => {
    try {
        const appSetting = await appSettings.getAppSettings();
        if (appSetting.tokens.enable) {
            const bytes = appSetting.tokens.earn_bytes;
            const accountRef = accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();

            if (docRef.exists) {
                const account = docRef.data();
                account.bytes = (account.bytes) ? (account.bytes + bytes) : bytes;
                account.id = userId;
                accountRef.update(account);
            } else {
                accountRef.set({ bytes: bytes, id: userId });
            }
        }
    } catch (error) {
        console.error(error);
        return error;
    }
};
