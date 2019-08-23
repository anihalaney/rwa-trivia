import {
    Account, AccountConstants, CollectionConstants, Game, GeneralConstants, LeaderBoardConstants
} from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { AccountAtomic } from '../model';
import { Utils } from '../utils/utils';
import { AppSettings } from './app-settings.service';

export class AccountService {

    private static accountFireStoreClient = admin.firestore();

    /**
     * getAccountById
     * return account
     */
    static async getAccountById(id: string): Promise<any> {
        try {
            const accountData = await AccountService.accountFireStoreClient.
                doc(`/${CollectionConstants.ACCOUNTS}/${id}`).get();
            return accountData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setAccount
     * return ref
     */
    static async setAccount(dbAccount: any): Promise<any> {
        try {
            return await AccountService.accountFireStoreClient
                .doc(`/${CollectionConstants.ACCOUNTS}/${dbAccount.id}`)
                .set(dbAccount, { merge: true });

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateAccount
     * return ref
     */
    static async updateAccountData(dbAccount: any): Promise<any> {
        try {
            return await AccountService.accountFireStoreClient
                .doc(`/${CollectionConstants.ACCOUNTS}/${dbAccount.id}`)
                .set(dbAccount, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAccounts
     * return accounts
     */
    static async getAccounts(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await AccountService.accountFireStoreClient
                    .collection(CollectionConstants.ACCOUNTS).get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * deleteAllAccounts
     * return any
     */
    static async deleteAllAccounts(): Promise<any> {
        try {
            AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).listDocuments().then(val => {
                val.map((res) => {
                    res.delete();
                });
            });

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * calculateAccountStat
     * return account
     */
    static calculateAccountStat(account: AccountAtomic, game: Game, categoryIds: Array<number>,
        userId: string, isMigration: boolean): AccountAtomic {

        const score = game.stats[userId].score;

        let avgAnsTime = game.stats[userId].avgAnsTime;
        avgAnsTime = (avgAnsTime) ? avgAnsTime : 0;

        account = (account) ? account : new Account();

        let increment;
        let badgesIncrement;

        if (!isMigration) {
            increment = Utils.changeFieldValue(1);
            badgesIncrement = Utils.changeFieldValue(score);
        }

        for (const id of categoryIds) {
            account.leaderBoardStats = (account.leaderBoardStats) ? account.leaderBoardStats : {};
            account.leaderBoardStats[id] = (account.leaderBoardStats && account.leaderBoardStats[id]) ?
                account.leaderBoardStats[id] + 1 : 1;
        }

        account[LeaderBoardConstants.LEADER_BOARD_STATS] = { ...account.leaderBoardStats };
        account.gamePlayed = (account.gamePlayed) ? (isMigration ? (account.gamePlayed as number) + 1 : increment) : 1;
        account.categories = Object.keys(account.leaderBoardStats).length;

        if (game.winnerPlayerId) {
            (game.winnerPlayerId === userId) ?
                account.wins = (account.wins) ? (isMigration ? (account.wins as number) + 1 : increment) : 1 :
                account.losses = (account.losses) ? (isMigration ? (account.losses as number) + 1 : increment) : 1;
        } else {
            account.losses = (account.losses) ? (isMigration ? (account.losses as number) + 1 : increment) : 1;
        }

        account.badges = (account.badges) ? (isMigration ? ((account.badges as number) + score) : badgesIncrement) : score;
        account.avgAnsTime = (account.avgAnsTime) ? Math.floor((account.avgAnsTime + avgAnsTime) / 2) : avgAnsTime;

        return account;
    }

    /**
     * decrease life
     * return ref
     */
    static async decreaseLife(userId) {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                const livesMilles = appSetting.lives.lives_after_add_millisecond;
                const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(userId);
                const docRef = await accountRef.get();
                const timestamp = Utils.getUTCTimeStamp();
                if (docRef.exists) {
                    const account = docRef.data();
                    if (account.lives === maxLives || !account.lastLiveUpdate) {
                        account.lastLiveUpdate = timestamp;
                        account.nextLiveUpdate = Utils.addMinutes(timestamp, livesMilles);
                    }
                    if (account.lives > 0) {
                        account.lives = Utils.changeFieldValue(-1);
                    }
                    accountRef.set(account, { merge: true });
                }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * increase number of lives set in appSettings
     * return ref
     */
    static async increaseLives(userId): Promise<any> {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.lives.enable) {
                await AccountService.addLife(userId, appSetting);
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * add default number of lives into account
     * return ref
     */
    static async addDefaultLives(user: any): Promise<any> {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(user.id);
                const docRef = await accountRef.get();
                if (docRef.exists) {
                    const account = docRef.data();
                    if (!account.lives) {
                        account.lives = maxLives;
                        account.id = user.id;
                        accountRef.set(account, { merge: true });
                    }
                } else {
                    accountRef.set({ lives: maxLives, id: user.id }, { merge: true });
                }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * add number of lives into account(Schedular)
     * return ref
     */
    static async addLives(): Promise<any> {
        try {
            const promises = [];
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.lives.enable) {
                const maxLives = appSetting.lives.max_lives;
                let timestamp = Utils.getUTCTimeStamp();
                const accountCollRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS)
                    .where(AccountConstants.NEXT_LIVE_UPDATE,
                        GeneralConstants.LESS_THAN_OR_EQUAL, timestamp);
                const accounts = await accountCollRef.get();
                const accountsNotHavingMaxLives = accounts.docs.filter(d => d.data().lives < maxLives);
                for (const account of accountsNotHavingMaxLives) {
                    timestamp = Utils.getUTCTimeStamp();
                    const userAccount = account.data();
                    promises.push(AccountService.addLife(userAccount.id, appSetting));
                }
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * Add life to account
     */
    static async addLife(userId: String, appSetting): Promise<any> {
        try {
            const timestamp = Utils.getUTCTimeStamp();
            const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(userId);
            const docRef = await accountRef.get();
            const account = docRef.data();
            if (docRef.exists) {
                if (account.lives < appSetting.lives.max_lives && account.nextLiveUpdate <= timestamp) {
                    account.lives += appSetting.lives.lives_add;
                    if (account.lives > appSetting.lives.max_lives) {
                        account.lives = appSetting.lives.max_lives;
                    } else {
                        // Update nextLiveUpdate
                        account.nextLiveUpdate = Utils.addMinutes(timestamp, appSetting.lives.lives_after_add_millisecond);
                    }
                    account.lastLiveUpdate = timestamp;
                    accountRef.set(account, { merge: true });
                }
            } else {
                accountRef.set({ lives: appSetting.lives.max_lives, id: userId }, { merge: true });
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async updateLives(userId): Promise<any> {
        try {
            return await AccountService.increaseLives(userId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * set number of bits into account
     */
    static async setBits(userId: any): Promise<any> {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.tokens.enable) {
                const bits = appSetting.tokens.earn_bits;

                const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(userId);
                const docRef = await accountRef.get();

                if (docRef.exists) {

                    const account = docRef.data();
                    account.bits = (account.bits) ? Utils.changeFieldValue(bits) : bits;
                    account.id = userId;
                    accountRef.set(account, { merge: true });
                } else {
                    accountRef.set({ bits: bits, id: userId }, { merge: true });
                }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * set number of bits into account
     */
    static async setBytes(userId: any): Promise<any> {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (appSetting.tokens.enable) {
                const bytes = appSetting.tokens.earn_bytes;
                const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(userId);
                const docRef = await accountRef.get();

                if (docRef.exists) {
                    const account = docRef.data();
                    account.bytes = (account.bytes) ? Utils.changeFieldValue(bytes) : bytes;
                    account.id = userId;
                    accountRef.set(account, { merge: true });
                } else {
                    accountRef.set({ bytes: bytes, id: userId }, { merge: true });
                }
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
    * set number of Bytes on question is contribute
    */
    static async earnBytesOnQuestionContribute(userId: any): Promise<any> {
        try {
            const appSetting = await AppSettings.Instance.getAppSettings();
            const bytes = appSetting.earn_bytes_on_question_contribute;
            const accountRef = AccountService.accountFireStoreClient.collection(CollectionConstants.ACCOUNTS).doc(userId);
            const docRef = await accountRef.get();

            if (docRef.exists) {
                const account = docRef.data();
                account.bytes = (account.bytes) ? Utils.changeFieldValue(bytes) : bytes;
                account.id = userId;
                accountRef.set(account, { merge: true });
            } else {
                accountRef.set({ bytes: bytes, id: userId }, { merge: true });
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
   * updateBits
   * return account
   */
    static async updateBits(userId: string, bits: number): Promise<any> {
        try {
            // const appSetting = await AppSettings.Instance.getAppSettings();
            const accountData = await AccountService.getAccountById(userId);
                accountData.bits = accountData.bits ? Utils.changeFieldValue(bits) : bits;
            await AccountService.updateAccountData(accountData);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
