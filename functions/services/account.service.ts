const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { Utils } from '../utils/utils';
const utils: Utils = new Utils();
import { Account } from '../../projects/shared-library/src/lib/shared/model';


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
                console.log('account> ');
                const lives = ref.data();
                // if (lives.lives === 4) {
                lives.livesUpdatedAt = timestamp;
                // }
                lives.lives += -1;
                docRef.update(lives);
            } else {
                docRef.set({ lives: 4, livesCreateAt: timestamp });
            }
        }).catch(function (error) {
            console.log(error.message);
        });
};



exports.increaseLife = (userId): Promise<any> => {
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
                        }
                        lives.livesUpdatedAt = timestamp;
                        docRef.update(lives);
                    }

                } else {
                    docRef.set({ lives: 4, livesCreateAt: timestamp });
                }
            }).catch(function (error) {
                console.log(error.message);
            });
};
