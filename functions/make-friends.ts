import { Invitation, Friends, FriendsMetadata } from '../src/app/model';
import { Observable } from 'rxjs/Observable';

export class MakeFriends {

    private token: string;
    private userId: string;
    private email: string;
    private db: any

    constructor(private validateKey?, private user_id?, private mail_id?, private firebaseDB?: any) {
        this.token = validateKey;
        this.userId = user_id;
        this.email = mail_id;
        this.db = firebaseDB;
    }

    validateToken(): Promise<string> {

        return this.db.doc(`/invitation/${this.token}`).get().then(invitation => {

            if (invitation.data().email === this.email) {
                const invitations = new Invitation();
                invitations.created_uid = invitation.data().created_uid;
                return this.getMyFriendsList(invitations.created_uid, this.user_id).then((ref) => {
                    return this.getMyFriendsList(this.user_id, invitations.created_uid).then((ref1) => {
                        return this.user_id;
                    })
                }
                );
            }
            return null;
        });
    }

    getMyFriendsList(inviter: string, invitee: string): Promise<string> {
        return this.db.doc(`/friends/${invitee}`).get().then(friend => {
            return this.makeFriends(friend.data(), inviter, invitee);
        })
    }

    makeFriends(friend: any, inviter: string, invitee: string): Promise<string> {

        if (friend !== undefined) {
            const array = friend.myFriends;
            let isExist = false;
            array.map((element, index) => {
                if (Object.keys(element)[index] === inviter) {
                    isExist = true;
                }

            });
            if (!isExist) {
                const obj = {};
                const metaInfo = new FriendsMetadata();
                metaInfo.date = new Date().getMilliseconds();
                metaInfo.created_uid = inviter;
                obj[inviter] = { ...metaInfo };
                const dbObj = { ...obj };
                array.push(dbObj);
                return this.db.doc(`/friends/${invitee}`).update({ myFriends: array }).then((ref) => {
                    return inviter
                });
            }
        } else {

            const friends = new Friends();
            friends.myFriends = [];
            const obj = {};
            const metaInfo = new FriendsMetadata();
            metaInfo.date = new Date().getMilliseconds();
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
            return this.db.doc(`/friends/${invitee}`).set(dbUser).then((ref) => {
                return inviter;
            }
            );

        }

    }
}
