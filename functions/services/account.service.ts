import { Account, Game } from '../../projects/shared-library/src/lib/shared/model';
import { AppSettings } from './app-settings.service';
import { Utils } from '../utils/utils';
import admin from '../db/firebase.client';

export class AccountService {

    private static accountFireStoreClient = admin.firestore();
    private static appSettings: AppSettings = new AppSettings();

    /**
     * getAccountById
     * return account
     */
    static async getAccountById(id: string): Promise<any> {
        try {
            return await this.accountFireStoreClient.doc(`/accounts/${id}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setAccount
     * return ref
     */
    static async setAccount(dbAccount: any): Promise<any> {
        try {
            return await this.accountFireStoreClient.doc(`/accounts/${dbAccount.id}`)
                .set(dbAccount);

        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * updateAccount
     * return ref
     */
    static async updateAccountData(dbAccount: any): Promise<any> {
        try {
            return await this.accountFireStoreClient.doc(`/accounts/${dbAccount.id}`).update(dbAccount);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }

    }

    /**
     * getAccounts
     * return accounts
     */
    static async getAccounts(): Promise<any> {
        try {
            return await this.accountFireStoreClient.collection('accounts').get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * calculateAccountStat
     * return account
     */
    static calculateAccountStat(account: Account, game: Game, categoryIds: Array<number>, userId: string): Account {
        const score = game.stats[userId].score;
        const avgAnsTime = game.stats[userId].avgAnsTime;
        // console.log('categoryIds', categoryIds);
        account = (account) ? account : new Account();

        for (const id of categoryIds) {
            account.leaderBoardStats = (account.leaderBoardStats) ? account.leaderBoardStats : {};
            account.leaderBoardStats[id] = (account.leaderBoardStats && account.leaderBoardStats[id]) ?
                account.leaderBoardStats[id] + score : score;
        }
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
    }

    /**
     * decrease life
     * return ref
     */
    static async decreaseLife(userId) {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                const livesMillis = appSetting.lives.lives_after_add_millisecond;
                const accountRef = this.accountFireStoreClient.collection(`accounts`).doc(userId);
                const docRef = await accountRef.get();
                const timestamp = Utils.getUTCTimeStamp();
                if (docRef.exists) {
                    const account = docRef.data();
                    if (account.lives === maxLives || !account.lastLiveUpdate) {
                        account.lastLiveUpdate = timestamp;
                        account.nextLiveUpdate = Utils.addMinutes(timestamp, livesMillis);
                    }
                    if (account.lives > 0) {
                        account.lives += -1;
                    }
                    accountRef.update(account);
                }
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * incrase number of lives set in appSettings
     * return ref
     */
    static async increaseLives(userId): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.lives.enable) {
                await this.addLife(userId, appSetting);
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * add default number of lives into account
     * return ref
     */
    static async addDefaultLives(user: any): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                const accountRef = this.accountFireStoreClient.collection(`accounts`).doc(user.id);
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
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * add number of lives into account(Schedular)
     * return ref
     */
    static async addLives(): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                let timestamp = Utils.getUTCTimeStamp();
                const accountCollRef = this.accountFireStoreClient.collection('accounts')
                    .where('nextLiveUpdate', '<=', timestamp);
                const accounts = await accountCollRef.get();
                const accountsNotHavingMaxLives = accounts.docs.filter(d => d.data().lives < maxLives);
                for (const account of accountsNotHavingMaxLives) {
                    timestamp = Utils.getUTCTimeStamp();
                    const userAccount = account.data();
                    await this.addLife(userAccount.id, appSetting);
                }
            }
        } catch (error) {
            console.error('Error : ', error);
            return error;
        }
    }

    /**
     * Add life to account
     */
    static async addLife(userId: String, appSetting): Promise<any> {
        try {
            const timestamp = Utils.getUTCTimeStamp();
            const accountRef = this.accountFireStoreClient.collection(`accounts`).doc(userId);
            const docRef = await accountRef.get();
            const account = docRef.data();
            if (docRef.exists) {
                if (account.lives < appSetting.lives.maxLives && account.nextLiveUpdate <= timestamp) {
                    account.lives += appSetting.lives.livesAdd;
                    if (account.lives > appSetting.lives.maxLives) {
                        account.lives = appSetting.lives.maxLives;
                    } else {
                        // Update nextLiveUpdate
                        account.nextLiveUpdate = Utils.addMinutes(timestamp, appSetting.lives.livesMillis);
                    }
                    account.lastLiveUpdate = timestamp;
                    accountRef.update(account);
                }
            } else {
                accountRef.set({ lives: appSetting.lives.maxLives, id: userId });
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    static async updateLives(userId): Promise<any> {
        try {
            return await this.increaseLives(userId);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * set number of bits into account
     */
    static async setBits(userId: any): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.tokens.enable) {
                const bits = appSetting.tokens.earn_bits;
                console.log('not bits', bits);
                const accountRef = this.accountFireStoreClient.collection(`accounts`).doc(userId);
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
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * set number of bits into account
     */
    static async setBytes(userId: any): Promise<any> {
        try {
            const appSetting = await this.appSettings.getAppSettings();
            if (appSetting.tokens.enable) {
                const bytes = appSetting.tokens.earn_bytes;
                const accountRef = this.accountFireStoreClient.collection(`accounts`).doc(userId);
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
            console.error('Error : ', error);
            throw error;
        }
    }
}
