import { interceptorConstants, ResponseMessagesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementMechanics } from '../utils/achievement-mechanics';
import { Utils } from '../utils/utils';

export class AchievementRulesController {

    /**
     * addAchievementRule
     * return message
     */
    static async addAchievementRule(req, res) {
        try {
            const name = req.body.name;
            const property = req.body.property;
            const displayOrder = req.body.displayOrder;
            const iconPath = req.body.iconPath;

            if (!name) {
                // Achievement name is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.ACHIEVEMENT_NAME_NOT_FOUND);
            }

            if (!property) {
                // Achievement property is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.ACHIEVEMENT_NAME_NOT_FOUND);
            }

            if (!displayOrder) {
                // Achievement property is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.DISPLAY_ORDER_NOT_FOUND);
            }

            await AchievementMechanics.addAchievementRule(name, property, displayOrder, iconPath);

            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.ACHIEVEMENT_RULES_ADDED_SUCCESSFULLY);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

}
