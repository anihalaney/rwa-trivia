import admin from '../db/firebase.client';

export class FriendService {

    private static friendFireStoreClient = admin.firestore();

    /**
     * createInvitation
     * return ref
     */
    static async createInvitation(dbInvitation: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.collection('invitations').add(dbInvitation);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * getInvitationByToken
     * return invitation
     */
    static async getInvitationByToken(token: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.doc(`/invitations/${token}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * checkInvitation
     * return invitation
     */
    static async  checkInvitation(email: string, userId: string): Promise<any> {
        try {
            return await this.friendFireStoreClient.collection('invitations')
                .where('created_uid', '==', userId)
                .where('email', '==', email)
                .get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    /**
     * updateInvitation
     * return userId
     */
    static async updateInvitation(invitation: any) {
        try {
            return await this.friendFireStoreClient.doc(`/invitations/${invitation.id}`)
                .update(invitation);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };



    /**
     * getFriendByInvitee
     * return friend
     */
    static async getFriendByInvitee(invitee: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.doc(`/friends/${invitee}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    /**
     * updateFriend
     * return ref
     */
    static async updateFriend(myFriends: any, invitee: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.doc(`/friends/${invitee}`)
                .update({ myFriends: myFriends });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };


    /**
     * setFriend
     * return ref
     */
    static async setFriend(dbUser: any, invitee: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.doc(`/friends/${invitee}`)
                .set(dbUser);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}