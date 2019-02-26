const friendService = require('../services/friend.service');
const friendUserService = require('../services/user.service');
import {
    Invitation, Friends, FriendsMetadata, friendInvitationConstants, User,
    pushNotificationRouteConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { PushNotification } from './push-notifications';
const pushNotification: PushNotification = new PushNotification();

export class MakeFriends {
    constructor(private token?: string, private userId?: string, private email?: string) { }

    validateToken(): Promise<string> {
        return friendService.getInvitationByToken(this.token)
            .then(invitation => {
                if (invitation.data().email === this.email) {
                    const invitationObj: Invitation = invitation.data();
                    invitationObj.status = friendInvitationConstants.APPROVED;
                    return this.updateFriendsList(invitationObj.created_uid, this.userId)
                        .then(ref => this.updateFriendsList(this.userId, invitationObj.created_uid))
                        .then(ref => friendService.updateInvitation({ ...invitationObj }))
                        .then(ref => this.userId);
                }
            });
    }

    updateFriendsList(inviter: string, invitee: string): Promise<string> {
        return friendService.getFriendByInvitee(invitee)
            .then(friend => this.makeFriends(friend.data(), inviter, invitee));
    }

    makeFriends(friend: any, inviter: string, invitee: string): Promise<string> {
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
                return friendService.updateFriend(myFriends, invitee)
                    .then(ref => inviter);
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
            return friendService.setFriend(dbUser, invitee)
                .then(ref => inviter);
        }
    }

    createInvitations(emails: string[]) {
        const invitationPromises = [];
        emails.map((email) => {
            invitationPromises.push(this.checkAndUpdateToken(email));
        });

        return Promise.all(invitationPromises)
            .then((invitationResults) => invitationResults)
            .catch((e) => {
                console.log('user invitations promise error', e);
            });
    }

    checkAndUpdateToken(email: string): Promise<string> {
        return friendService.checkInvitation(email, this.userId)
            .then(snapshot => {
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

            });
    }

    createInvitation(dbInvitation: any): Promise<string> {
        this.sendNotification(dbInvitation);
        return friendService.createInvitation(dbInvitation)
            .then(ref => {
                dbInvitation.id = ref.id;
                return friendService.updateInvitation(dbInvitation).then(dRef => `Invitation is sent on ${dbInvitation.email}`);
            });
    }

    sendNotification(dbInvitation: any) {
        friendUserService.getUsersByEmail(dbInvitation)
            .then(snapshots => {

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
            }).catch(error => {
                console.log('error', error);
            });
    }

    getUser(userId): Promise<any> {
        return friendUserService.getUserById(userId);
    }
}
