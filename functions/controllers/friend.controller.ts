import { MakeFriends } from '../utils/make-friends';

/**
 * getSubscriptionCount
 * return count
 */
exports.createFriends = (req, res) => {
    const token = req.body.token;
    const userId = req.body.userId;
    const email = req.body.email;


    const makeFriends: MakeFriends = new MakeFriends(token, userId, email);
    makeFriends.validateToken().then((invitee) => {
        console.log('invitee', invitee);
        res.send({ created_uid: invitee });
    });
};


/**
 * createInvitations
 * return string
 */
exports.createInvitations = (req, res) => {

    const userId = req.body.userId;
    const emails = req.body.emails;


    if (!emails || !userId) {
        res.status(400).send('Bad Request');
    }

    const makeFriends: MakeFriends = new MakeFriends(undefined, userId, undefined);
    makeFriends.createInvitations(emails).then((status: string[]) => {
        res.send({ messages: status.join('<br />') });
    });
};
