import admin from '../db/firebase.client';
const friendFireStoreClient = admin.firestore();


/**
 * createInvitation
 * return ref
 */
exports.createInvitation = async (dbInvitation: any): Promise<any> => {
    try {
        return await friendFireStoreClient.collection('invitations').add(dbInvitation);
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * getInvitationByToken
 * return invitation
 */
exports.getInvitationByToken = async (token: any): Promise<any> => {
    try {
        return await friendFireStoreClient.doc(`/invitations/${token}`).get();
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * checkInvitation
 * return invitation
 */
exports.checkInvitation = async (email: string, userId: string): Promise<any> => {
    try {
        return await friendFireStoreClient.collection('invitations')
            .where('created_uid', '==', userId)
            .where('email', '==', email)
            .get();
    } catch (error) {
        console.error(error);
        return error;
    }
};

/**
 * updateInvitation
 * return userId
 */
exports.updateInvitation = async (invitation: any): Promise<any> => {
    try {
        return await friendFireStoreClient.doc(`/invitations/${invitation.id}`)
            .update(invitation);
    } catch (error) {
        console.error(error);
        return error;
    }
};



/**
 * getFriendByInvitee
 * return friend
 */
exports.getFriendByInvitee = async (invitee: any): Promise<any> => {
    try {
        return await friendFireStoreClient.doc(`/friends/${invitee}`).get();
    } catch (error) {
        console.error(error);
        return error;
    }
};


/**
 * updateFriend
 * return ref
 */
exports.updateFriend = async (myFriends: any, invitee: any): Promise<any> => {
    try {
        return await friendFireStoreClient.doc(`/friends/${invitee}`)
            .update({ myFriends: myFriends });
    } catch (error) {
        console.error(error);
        return error;
    }
};


/**
 * setFriend
 * return ref
 */
exports.setFriend = async (dbUser: any, invitee: any): Promise<any> => {
    try {
        return await friendFireStoreClient.doc(`/friends/${invitee}`)
            .set(dbUser);
    } catch (error) {
        console.error(error);
        return error;
    }
};

