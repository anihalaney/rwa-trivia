import { MakeFriends } from '../utils/make-friends';
import { Utils } from '../utils/utils';
import { interceptorConstants, ResponseMessagesConstants, FriendConstants } from 'shared-library/shared/model';

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
            Utils.sendResponse(res, interceptorConstants.SUCCESS, { created_uid: invitee });
        } catch (error) {
            Utils.sendErr(res, error);
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
                        Utils.sendResponse(res, interceptorConstants.SUCCESS, { messages: status.join(FriendConstants.BR_HTML) });
                    }
                } else {
                    const status: any = await makeFriends.createInvitations(emails);
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, { messages: status.join(FriendConstants.BR_HTML) });
                }
            } catch (error) {
                Utils.sendErr(res, error);
            }
        } else {
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.BAD_REQUEST);
        }
    }
}
