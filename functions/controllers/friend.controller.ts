import { MakeFriends } from '../utils/make-friends';

export class FriendController {

    /**
     * getSubscriptionCount
     * return count
     */
    static async createFriends(req, res): Promise<any> {
        const token = req.body.token;
        const userId = req.body.userId;
        const email = req.body.email;


        try {
            const makeFriends: MakeFriends = new MakeFriends(token, userId, email);
            const invitee = await makeFriends.validateToken();
            res.status(200).send({ created_uid: invitee });
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }


    /**
     * createInvitations
     * return string
     */
    static async createInvitations(req, res): Promise<any> {

        const userId = req.body.userId;
        let emails = req.body.emails;
        const inviteeUserId = req.body.inviteeUserId;

        if ((inviteeUserId || emails) && userId) {
            const makeFriends: MakeFriends = new MakeFriends(undefined, userId, undefined);
            try {
                if (inviteeUserId) {
                    const userData = await makeFriends.getUser(inviteeUserId);
                    const user = userData.data();
                    if (inviteeUserId && user) {
                        emails = [user.email];
                        const status: any = await makeFriends.createInvitations(emails);
                        res.status(200).send({ messages: status.join('<br />') });
                    }
                } else {
                    const status: any = await makeFriends.createInvitations(emails);
                    res.status(200).send({ messages: status.join('<br />') });
                }
            } catch (error) {
                console.error('Error : ', error);
                res.status(500).send('Internal Server error');
                return error;
            }
        } else {
            res.status(400).send('Bad Request');
        }
    }
}
