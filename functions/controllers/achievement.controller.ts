import { interceptorConstants, ResponseMessagesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementMechanics } from '../utils/achievement-mechanics';
import { Utils } from '../utils/utils';

export class AchievementController {

    /**
     * addAchievement
     * return message
     */
    static async addAchievement(req, res) {
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

            await AchievementMechanics.addNewAchievement(name, property);

            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.ACHIEVEMENT_ADDED_SUCCESSFULLY);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }
}
