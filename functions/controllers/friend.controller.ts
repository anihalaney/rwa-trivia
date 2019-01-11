import { MakeFriends } from '../utils/make-friends';
const userService = require('../services/user.service');


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
    let emails = req.body.emails;
    const inviteeUserId = req.body.inviteeUserId;

    if ((inviteeUserId || emails) && userId) {
        const makeFriends: MakeFriends = new MakeFriends(undefined, userId, undefined);

        if (inviteeUserId) {
            makeFriends.getUser(inviteeUserId).then(userData => {
                const user = userData.data();
                if (inviteeUserId && user) {
                    emails = [user.email];
                    makeFriends.createInvitations(emails).then((status: string[]) => {
                        res.send({ messages: status.join('<br />') });
                    });
                }
            });
        } else {
            makeFriends.createInvitations(emails).then((status: string[]) => {
                res.send({ messages: status.join('<br />') });
            });
        }
    } else {
        res.status(400).send('Bad Request');
    }



};
