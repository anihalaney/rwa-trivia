const userFireBaseClient = require('../db/firebase-client');
const userFireStoreClient = userFireBaseClient.firestore();
const bucket = userFireBaseClient.storage().bucket();
const stream = require('stream');
import { User } from '../../projects/shared-library/src/lib/shared/model';
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
    return userFireStoreClient.doc(`/users/${dbUser.userId}`).update(dbUser).then(ref => { return ref })
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
 * getUsersByEmail
 * return users
 */
exports.getUsersByEmail = (obj: any): Promise<any> => {
    return userFireStoreClient.collection('users')
        .where('email', '==', obj.email).get()
        .then(users => { return users })
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

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        chunks.push(users.slice(i, i + BATCH_SIZE));
    }

    let promises: Promise<any>[];
    chunks.map((chunk) => {
        console.log(chunk);
        promises = chunk.map((user) => {
            const batch = userFireStoreClient.batch();
            Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
            const userInstance = userFireStoreClient.collection('users').doc(user.userId);
            batch.set(userInstance, { ...user }, { merge: true });
            return batch.commit().then((ref) => {
                return ref;
            });
        });
    });

    return Promise.all(promises);
};


/**
 * generateProfileImage
 * return stream
 */
exports.generateProfileImage = (userId: string, profilePicture: string, size: string): Promise<string> => {
    const fileName = (size) ? `profile/${userId}/avatar/${size}/${profilePicture}` : `profile/${userId}/avatar/${profilePicture}`;
    const file = bucket.file(fileName);
    return file.download().then(streamData => {
        return streamData[0];
    }).catch(error => {
        console.log('error', error);
        return error;
    })
};


/**
 * uploadProfileImage
 * return status
 */
exports.uploadProfileImage = (data: any, mimeType: any, filePath: string, ): Promise<string> => {

    const file = bucket.file(filePath);
    const dataStream = new stream.PassThrough();
    dataStream.push(data);
    dataStream.push(null);
    mimeType = (mimeType) ? mimeType : dataStream.mimetype;

    return new Promise((resolve, reject) => {
        dataStream.pipe(file.createWriteStream({
            metadata: {
                contentType: mimeType,
                metadata: {
                    custom: 'metadata'
                }
            }
        }))
            .on('error', function (err) {
                console.log('error', err);
                reject(err);
            })
            .on('finish', function () {
                resolve('upload finished');
            });
    });

};

exports.removeSocialProfile = async (): Promise<any> => {
    const users = await this.getUsers();

    const migrationPromises = users.docs.map(user => {
        const userObj: User = user.data();
         userObj.facebookUrl = null;
        userObj.linkedInUrl = null;
        userObj.twitterUrl = null;
        return this.setUser(userObj);
    });

    const migrationResults = await Promise.all(migrationPromises);
    return migrationResults;
};

