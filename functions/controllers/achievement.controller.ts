import { interceptorConstants, ResponseMessagesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementMechanics } from '../utils/achievement-mechanics';
import { Utils } from '../utils/utils';

export class AchievementController {

    /**
     * getAll
     * return message
     */
    static async getAll(req, res) {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await AchievementMechanics.retrieveAchievements(req.user.uid));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

}
