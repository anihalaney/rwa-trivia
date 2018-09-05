const fireBaseClient = require('../db/firebase-client');
const fireBaseAuthClient = fireBaseClient.auth();


/**
 * getUsers
 * return users
 */
exports.getAuthUsers = (nextPageToken?: string): Promise<any> => {
    return fireBaseAuthClient.listUsers(1000, nextPageToken)
        .then((listUsersResult) => { return listUsersResult; })
        .catch((error) => {
            console.log('Error listing users:', error);
            return error;
        });
};
