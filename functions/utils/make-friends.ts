import { FriendService } from '../services/friend.service';
import { UserService } from '../services/user.service';
import {
    Invitation, Friends, FriendsMetadata, friendInvitationConstants, User,
    pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { PushNotification } from './push-notifications';


export class MakeFriends {

    token: string;
    userId: string;
    email: string;

    constructor(token?: string, userId?: string, email?: string) {
        this.token = token;
        this.userId = userId;
        this.email = email;
    }

    async validateToken(): Promise<string> {
        try {
            const invitation = await FriendService.getInvitationByToken(this.token);
            if (invitation.data().email === this.email) {
                const invitationObj: Invitation = invitation.data();
                invitationObj.status = friendInvitationConstants.APPROVED;
                await this.updateFriendsList(invitationObj.created_uid, this.userId);
                await this.updateFriendsList(this.userId, invitationObj.created_uid);
                await FriendService.updateInvitation({ ...invitationObj });
                return this.userId;
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    async updateFriendsList(inviter: string, invitee: string): Promise<string> {
        try {
            const friend = await FriendService.getFriendByInvitee(invitee);
            return this.makeFriends(friend.data(), inviter, invitee);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    async makeFriends(friend: any, inviter: string, invitee: string): Promise<string> {
        try {
            if (friend !== undefined) {
                const myFriends: Array<any> = friend.myFriends;
                const isExist = myFriends.filter(myFriend => Object.keys(myFriend)[0] === inviter).length > 0 ? true : false;
                if (!isExist) {
                    const obj = {};
                    const metaInfo = new FriendsMetadata();
                    metaInfo.date = new Date().getUTCDate();
                    metaInfo.created_uid = inviter;
                    obj[inviter] = { ...metaInfo };
                    const dbObj = { ...obj };
                    myFriends.push(dbObj);
                    return await FriendService.updateFriend(myFriends, invitee);
                }
            } else {
                const friends = new Friends();
                friends.myFriends = [];
                const obj = {};
                const metaInfo = new FriendsMetadata();
                metaInfo.date = new Date().getUTCDate();
                if (this.userId !== invitee) {
                    metaInfo.created_uid = inviter;
                    friends.created_uid = inviter;
                } else {
                    metaInfo.created_uid = invitee;
                    friends.created_uid = invitee;
                }
                obj[inviter] = { ...metaInfo };
                friends.myFriends.push({ ...obj });
                const dbUser = { ...friends };
                return await FriendService.setFriend(dbUser, invitee);
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    async createInvitations(emails: string[]) {
        const invitationPromises = [];
        emails.map((email) => {
            invitationPromises.push(this.checkAndUpdateToken(email));
        });

        try {
            return await Promise.all(invitationPromises);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    async checkAndUpdateToken(email: string): Promise<string> {
        try {
            const snapshot = await FriendService.checkInvitation(email, this.userId);

            const invitationNewObj: Invitation = new Invitation();
            invitationNewObj.created_uid = this.userId;
            invitationNewObj.email = email;
            invitationNewObj.status = friendInvitationConstants.PENDING;
            if (snapshot.empty) {
                return this.createInvitation({ ...invitationNewObj });
            } else {
                const invitation = snapshot.docs[0];
                if (invitation.exists) {
                    const invitationObj: Invitation = invitation.data();
                    if (invitationObj.status === friendInvitationConstants.APPROVED ||
                        invitationObj.status === friendInvitationConstants.REJECTED) {
                        return `User with email as ${email} is already friend`;
                    } else {
                        return this.createInvitation({ ...invitationObj });
                    }
                } else {
                    return this.createInvitation({ ...invitationNewObj });
                }
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    async createInvitation(dbInvitation: any): Promise<string> {
        this.sendNotification(dbInvitation);

        try {
            const ref = await FriendService.createInvitation(dbInvitation);
            dbInvitation.id = ref.id;
            await FriendService.updateInvitation(dbInvitation);
            return `Invitation is sent on ${dbInvitation.email}`;
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    async sendNotification(dbInvitation: any) {
        try {
            const snapshots = await UserService.getUsersByEmail(dbInvitation);
            if (snapshots.empty) {
                console.log('user does not exist');
            } else {
                const snapshot = snapshots.docs[0];
                if (snapshot.exists) {
                    const userObj: User = snapshot.data();

                    PushNotification.sendGamePlayPushNotifications(dbInvitation, userObj.userId,
                        pushNotificationRouteConstants.FRIEND_NOTIFICATIONS);
                } else {
                    console.log('user does not exist');
                }
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }

    }

    async getUser(userId): Promise<any> {
        try {
            return await UserService.getUserById(userId);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
