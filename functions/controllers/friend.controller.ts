import { FriendConstants, interceptorConstants, ResponseMessagesConstants, User } from '../../projects/shared-library/src/lib/shared/model';
import { MakeFriends } from '../utils/make-friends';
import { Utils } from '../utils/utils';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';

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
            Utils.sendError(res, error);
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
                const appSetting = await AppSettings.Instance.getAppSettings();
                if (inviteeUserId) {
                    const user: User = await makeFriends.getUser(inviteeUserId);
                    if (inviteeUserId && user) {
                        emails = [user.email];
                        const status: any = await makeFriends.createInvitations(emails);
                      
                        if (appSetting.invite_bits_enabled) {
                            await AccountService.updateBits(userId, appSetting.invite_bits);
                        }
                        Utils.sendResponse(res, interceptorConstants.SUCCESS, { messages: status.join(FriendConstants.BR_HTML) });
                    }
                } else {
                    const status: any = await makeFriends.createInvitations(emails);
                    if (appSetting.invite_bits_enabled) {
                        await AccountService.updateBits(userId, appSetting.invite_bits);
                    }
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, { messages: status.join(FriendConstants.BR_HTML) });
                }
            } catch (error) {
                Utils.sendError(res, error);
            }
        } else {
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.BAD_REQUEST);
        }
    }
}
