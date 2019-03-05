import { FriendService } from '../services/friend.service';
import { UserService } from '../services/user.service';
import {
    Invitation, Friends, FriendsMetadata, friendInvitationConstants, User,
    pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { PushNotification } from './push-notifications';
const pushNotification: PushNotification = new PushNotification();

export class MakeFriends {

    constructor(private token?: string, private userId?: string, private email?: string) {
    }

    async validateToken(): Promise<string> {
        try {
            let invitation = await FriendService.getInvitationByToken(this.token);
            if (invitation.data().email === this.email) {
                const invitationObj: Invitation = invitation.data();
                invitationObj.status = friendInvitationConstants.APPROVED;
                await this.updateFriendsList(invitationObj.created_uid, this.userId);
                await this.updateFriendsList(this.userId, invitationObj.created_uid);
                await FriendService.updateInvitation({ ...invitationObj });
                return this.userId;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateFriendsList(inviter: string, invitee: string): Promise<string> {
        try {
            let friend = await FriendService.getFriendByInvitee(invitee);
            return this.makeFriends(friend.data(), inviter, invitee);
        } catch (error) {
            console.error(error);
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
                    let ref = await FriendService.updateFriend(myFriends, invitee);
                    if (ref) {
                        return inviter;
                    }
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
                let ref = await FriendService.setFriend(dbUser, invitee)
                if (ref) {
                    return inviter;
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async createInvitations(emails: string[]) {
        const invitationPromises = [];
        emails.map((email) => {
            invitationPromises.push(this.checkAndUpdateToken(email));
        });

        try {
            return await Promise.all(invitationPromises)
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async checkAndUpdateToken(email: string): Promise<string> {
        try {
            let snapshot = await FriendService.checkInvitation(email, this.userId);

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
            console.error(error);
            throw error;
        }
    }

    async createInvitation(dbInvitation: any): Promise<string> {
        this.sendNotification(dbInvitation);

        try {
            let ref = await FriendService.createInvitation(dbInvitation);
            dbInvitation.id = ref.id;
            let dref = await FriendService.updateInvitation(dbInvitation)
            return `Invitation is sent on ${dbInvitation.email}`
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async sendNotification(dbInvitation: any) {
        try {
            let snapshots = await UserService.getUsersByEmail(dbInvitation);
            if (snapshots.empty) {
                console.log('user does not exist');
            } else {
                const snapshot = snapshots.docs[0];
                if (snapshot.exists) {
                    const userObj: User = snapshot.data();

                    pushNotification.sendGamePlayPushNotifications(dbInvitation, userObj.userId,
                        pushNotificationRouteConstants.FRIEND_NOTIFICATIONS);
                } else {
                    console.log('user does not exist');
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async getUser(userId): Promise<any> {
        try {
            return await UserService.getUserById(userId); 
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
