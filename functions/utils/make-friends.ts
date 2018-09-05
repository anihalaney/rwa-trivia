const friendService = require('../services/friend.service');
import { Invitation, Friends, FriendsMetadata } from '../../projects/shared-library/src/lib/shared/model';
import { Observable } from 'rxjs';

export class MakeFriends {

    constructor(private token: string, private userId: string, private email: string) { }

    validateToken(): Promise<string> {
        return friendService.getInvitationByToken(this.token)
            .then(invitation => {
                if (invitation.data().email === this.email) {
                    const invitations = new Invitation();
                    invitations.created_uid = invitation.data().created_uid;
                    return this.updateFriendsList(invitations.created_uid, this.userId)
                        .then(ref => this.updateFriendsList(this.userId, invitations.created_uid))
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
}
