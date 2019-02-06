const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
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
 * updateAccount
 * return ref
 */
exports.updateAccount = (dbAccount: any): Promise<any> => {
    return accountFireStoreClient.doc(`/accounts/${dbAccount.id}`).update(dbAccount).then(ref => { return ref })
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


