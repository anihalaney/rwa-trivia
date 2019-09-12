import { FriendService } from '../services/friend.service';
import { UserService } from '../services/user.service';
import {
    Invitation, Friends, FriendsMetadata, friendInvitationConstants, User,
    pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { PushNotification } from './push-notifications';
import { Utils } from './utils';
import { AppSettings } from '../services/app-settings.service';
import { AccountService } from '../services/account.service';

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
            const invitationObj: Invitation = await FriendService.getInvitationByToken(this.token);
            const appSetting = await AppSettings.Instance.getAppSettings();
            if (invitationObj.email === this.email) {
                invitationObj.status = friendInvitationConstants.APPROVED;
                await this.updateFriendsList(invitationObj.created_uid, this.userId);
                await this.updateFriendsList(this.userId, invitationObj.created_uid);
                await FriendService.updateInvitation({ ...invitationObj });
                if (appSetting.invite_bits_enabled) {
                    await AccountService.updateBits(invitationObj.created_uid, appSetting.invite_bits);
                }
                return this.userId;
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    async updateFriendsList(inviter: string, invitee: string): Promise<string> {
        try {
            const friend: Friends = await FriendService.getFriendByInvitee(invitee);
            return this.makeFriends(friend, inviter, invitee);
        } catch (error) {
            return Utils.throwError(error);
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
            return Utils.throwError(error);
        }
    }


    async createInvitations(emails: string[]) {
        const invitationPromises = [];
        for (const email of emails) {
            invitationPromises.push(this.checkAndUpdateToken(email));
        }

        try {
            return await Promise.all(invitationPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    async checkAndUpdateToken(email: string): Promise<string> {
        try {
            const invitations: Invitation[] = await FriendService.checkInvitation(email, this.userId);

            const invitationNewObj: Invitation = new Invitation();
            invitationNewObj.created_uid = this.userId;
            invitationNewObj.email = email;
            invitationNewObj.status = friendInvitationConstants.PENDING;
            invitationNewObj.createdAt = Utils.getUTCTimeStamp();
            if (invitations.length <= 0) {
                return this.createInvitation({ ...invitationNewObj });
            } else {
                const invitationObj = invitations[0];
                if (invitationObj.status === friendInvitationConstants.APPROVED ||
                    invitationObj.status === friendInvitationConstants.REJECTED) {
                    return `User with email as ${email} is already friend`;
                } else {
                    return this.createInvitation({ ...invitationObj });
                }
            }
        } catch (error) {
            return Utils.throwError(error);
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
            return Utils.throwError(error);
        }
    }

    async sendNotification(dbInvitation: any) {
        try {
            const users: User[] = await UserService.getUsersByEmail(dbInvitation);
            if (users.length <= 0) {
                console.log('user does not exist');
            } else {
                const userObj = users[0];
                PushNotification.sendGamePlayPushNotifications(dbInvitation, userObj.userId,
                    pushNotificationRouteConstants.FRIEND_NOTIFICATIONS);
            }
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    async getUser(userId): Promise<any> {
        try {
            return await UserService.getUserById(userId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
