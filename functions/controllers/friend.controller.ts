import { MakeFriends } from '../utils/make-friends';

/**
 * getSubscriptionCount
 * return count
 */
exports.createFriends = async (req, res): Promise<any> => {
    const token = req.body.token;
    const userId = req.body.userId;
    const email = req.body.email;


    const makeFriends: MakeFriends = new MakeFriends(token, userId, email);
    const invitee = await makeFriends.validateToken();
    res.send({ created_uid: invitee });
};


/**
 * createInvitations
 * return string
 */
exports.createInvitations = async (req, res): Promise<any> => {

    const userId = req.body.userId;
    let emails = req.body.emails;
    const inviteeUserId = req.body.inviteeUserId;

    if ((inviteeUserId || emails) && userId) {
        const makeFriends: MakeFriends = new MakeFriends(undefined, userId, undefined);

        if (inviteeUserId) {
            const userData = await makeFriends.getUser(inviteeUserId);
            const user = userData.data();
            if (inviteeUserId && user) {
                emails = [user.email];
                const status: any = await makeFriends.createInvitations(emails);
                res.send({ messages: status.join('<br />') });
            }
        } else {
            const status: any = await makeFriends.createInvitations(emails);
                res.send({ messages: status.join('<br />') });
        }
    } else {
        res.status(400).send('Bad Request');
    }



};
