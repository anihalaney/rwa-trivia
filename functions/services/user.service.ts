const userFireBaseClient = require('../db/firebase-client');
const userFireStoreClient = userFireBaseClient.firestore();

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
