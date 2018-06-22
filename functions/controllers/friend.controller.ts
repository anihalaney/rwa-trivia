
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
