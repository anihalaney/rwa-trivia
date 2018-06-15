const userFireBaseClient = require('../db/firebase-client');
const userFireStoreClient = userFireBaseClient.firestore();
import { User } from '../../src/app/model';
/**
 * getUserById
 * return user
 */
exports.getUserById = (userId: string): Promise<any> => {
    return userFireStoreClient.doc(`/users/${userId}`)
        .get()
        .then(u => { return u })
        .catch(error => {
            console.error(error);
            return error;
        });
};


/**
 * setUser
 * return ref
 */
exports.setUser = (dbUser: any): Promise<any> => {
    return userFireStoreClient.doc(`/users/${dbUser.userId}`).set(dbUser).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};


/**
 * getUsers
 * return users
 */
exports.getUsers = (): Promise<any> => {
    return userFireStoreClient.collection('users')
        .get().then(users => { return users })
        .catch(error => {
            console.error(error);
            return error;
        });
};

/**
 * Add/Update Authenticated Users
 * return ref
 */
exports.addUpdateAuthUsersToFireStore = (users: Array<User>): Promise<any> => {
    const batch = userFireStoreClient.batch();
    users.map((user) => {
        const userInstance = userFireStoreClient.collection('users').doc(user.userId);
        batch.set(userInstance, { ...user }, { merge: true });
    })
    return batch.commit().then((ref) => { return ref });
};
