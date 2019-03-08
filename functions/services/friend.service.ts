import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { CollectionConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';

export class FriendService {

    private static friendFireStoreClient = admin.firestore();
    private static FS = GeneralConstants.FORWARD_SLASH;

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
            const invitationData = await this.friendFireStoreClient
                .doc(`${this.FS}${CollectionConstants.INVITATIONS}${this.FS}${token}`)
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
            return Utils.getValesFromFirebaseSnapshot(
                await this.friendFireStoreClient
                    .collection(CollectionConstants.INVITATIONS)
                    .where(GeneralConstants.CREATED_UID, GeneralConstants.DOUBLE_EQUAL, userId)
                    .where(GeneralConstants.EMAIL, GeneralConstants.DOUBLE_EQUAL, email)
                    .get()
            );
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
                .doc(`${this.FS}${CollectionConstants.INVITATIONS}${this.FS}${invitation.id}`)
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
                .doc(`${this.FS}${CollectionConstants.FRIENDS}${this.FS}${invitee}`)
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
                .doc(`${this.FS}${CollectionConstants.FRIENDS}${this.FS}${invitee}`)
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
                .doc(`${this.FS}${CollectionConstants.FRIENDS}${this.FS}${invitee}`)
                .set(dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
