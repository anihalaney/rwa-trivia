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
    const BATCH_SIZE = 500;
    const chunks: User[][] = [];

    for (var i = 0; i < users.length; i += BATCH_SIZE) {
        chunks.push(users.slice(i, i + BATCH_SIZE));
    }

    let promises: Promise<any>[];
    chunks.map((chunk) => {
        console.log(chunk);
        promises = chunk.map((user) => {
            let batch = userFireStoreClient.batch();
            Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
            const userInstance = userFireStoreClient.collection('users').doc(user.userId);
            batch.set(userInstance, { ...user }, { merge: true });
            return batch.commit().then((ref) => {
                console.log("saved user chunk");
                return ref;
            });
        });
    });

    return Promise.all(promises);
};


/**
 * getImage
 * return ref
 */
exports.generateProfileImage = (userId: string, profilePicture: string): Promise<string> => {
    const fileName = `profile/${userId}/avatar/${profilePicture}`;
    const file = bucket.file(fileName);
    return file.download().then(downloadUrl => {
        return downloadUrl[0];
    }).catch(error => {
        console.log('error', error);
        return error;
    })
};
