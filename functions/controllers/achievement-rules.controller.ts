import { interceptorConstants, ResponseMessagesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementMechanics } from '../utils/achievement-mechanics';
import { Utils } from '../utils/utils';
import { AccountService } from '../services/account.service';

export class AchievementRulesController {

    /**
     * addAchievementRule
     * return message
     */
    static async addAchievementRule(req, res) {
        try {
            const name = req.body.name;
            const property = req.body.property;

            if (!name) {
                // Achievement name is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.ACHIEVEMENT_NAME_NOT_FOUND);
            }

            if (!property) {
                // Achievement property is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.ACHIEVEMENT_NAME_NOT_FOUND);
            }

            await AchievementMechanics.addAchievementRule(name, property);

            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.ACHIEVEMENT_ADDED_SUCCESSFULLY);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }



    /**
     * setAchievement
     * return message
     */
    static async setAchievementRule(req, res) {
        try {

            const account: Account = await AccountService.getAccountById('rQWSRKCFpcPZLkCyKcDpATGXNlw1');

            await AchievementMechanics.updateAchievement(account);

            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.ACHIEVEMENT_ADDED_SUCCESSFULLY);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }




}
