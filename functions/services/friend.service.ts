const friendFireBaseClient = require('../db/firebase-client');
const friendFireStoreClient = friendFireBaseClient.firestore();
/**
 * getInvitationByToken
 * return invitation
 */
exports.getInvitationByToken = (token: any): Promise<any> => {
    return friendFireStoreClient.doc(`/invitations/${token}`)
        .get()
        .then(invitation => { return invitation });
};


/**
 * getFriendByInvitee
 * return friend
 */
exports.getFriendByInvitee = (invitee: any): Promise<any> => {
    return friendFireStoreClient.doc(`/friends/${invitee}`)
        .get()
        .then(friend => { return friend });
};


/**
 * updateFriend
 * return ref
 */
exports.updateFriend = (myFriends: any, invitee: any): Promise<any> => {
    return friendFireStoreClient.doc(`/friends/${invitee}`)
        .update({ myFriends: myFriends })
        .then(ref => { return ref });
};


/**
 * setFriend
 * return ref
 */
exports.setFriend = (dbUser: any, invitee: any): Promise<any> => {
    return friendFireStoreClient.doc(`/friends/${invitee}`)
        .set(dbUser)
        .then(ref => { return ref });
};

