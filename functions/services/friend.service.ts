import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';

export class FriendService {

    private static friendFireStoreClient = admin.firestore();

    /**
     * createInvitation
     * return ref
     */
    static async createInvitation(dbInvitation: any): Promise<any> {
        try {
            return await this.friendFireStoreClient.collection(CollectionConstants.INVITATIONS).add(dbInvitation);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getInvitationByToken
     * return invitation
     */
    static async getInvitationByToken(token: any): Promise<any> {
        try {
            const invitationData = this.friendFireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.INVITATIONS}${GeneralConstants.FORWARD_SLASH}${token}`)
                .get();
            return invitationData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * checkInvitation
     * return invitation
     */
    static async checkInvitation(email: string, userId: string): Promise<any> {
        try {
            return Utils.getObjectValues(await this.friendFireStoreClient.collection(CollectionConstants.INVITATIONS)
                .where(GeneralConstants.CREATED_UID, GeneralConstants.DOUBLE_EQUAL, userId)
                .where(GeneralConstants.EMAIL, GeneralConstants.DOUBLE_EQUAL, email)
                .get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateInvitation
     * return userId
     */
    static async updateInvitation(invitation: any) {
        try {
            return await this.friendFireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.INVITATIONS}${GeneralConstants.FORWARD_SLASH}${invitation.id}`)
                .update(invitation);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getFriendByInvitee
     * return friend
     */
    static async getFriendByInvitee(invitee: any): Promise<any> {
        try {
            const friends = await this.friendFireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.FRIENDS}${GeneralConstants.FORWARD_SLASH}${invitee}`)
                .get();
            return friends.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateFriend
     * return ref
     */
    static async updateFriend(myFriends: any, invitee: any): Promise<any> {
        try {
            return await this.friendFireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.FRIENDS}${GeneralConstants.FORWARD_SLASH}${invitee}`)
                .update({ myFriends: myFriends });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setFriend
     * return ref
     */
    static async setFriend(dbUser: any, invitee: any): Promise<any> {
        try {
            return await this.friendFireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.FRIENDS}${GeneralConstants.FORWARD_SLASH}${invitee}`)
                .set(dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
