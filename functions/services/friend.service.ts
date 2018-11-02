const friendFireBaseClient = require('../db/firebase-client');
const friendFireStoreClient = friendFireBaseClient.firestore();


/**
 * createInvitation
 * return ref
 */
exports.createInvitation = (dbInvitation: any): Promise<any> => {
    return friendFireStoreClient.collection('invitations').add(dbInvitation).then(ref => ref);
};

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
 * checkInvitation
 * return invitation
 */
exports.checkInvitation = (email: string, userId: string): Promise<any> => {
    return friendFireStoreClient.collection('invitations')
        .where('created_uid', '==', userId)
        .where('email', '==', email)
        .get()
        .then(snapshot => snapshot);
};

/**
 * updateInvitation
 * return userId
 */
exports.updateInvitation = (invitation: any): Promise<any> => {
    return friendFireStoreClient.doc(`/invitations/${invitation.id}`)
        .update(invitation)
        .then(ref => { return invitation.created_uid });
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

