import * as express from 'express';
import { RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementRulesController } from '../controllers/achievement-rules.controller';
import { AuthMiddleware } from '../middlewares/auth';

class AchievementRulesRoutes {

    public achievementRulesRoutes: any;

    constructor() {

        this.achievementRulesRoutes = express.Router();

        //  '/rules/add'
        this.achievementRulesRoutes.post(`/${RoutesConstants.RULES}/${RoutesConstants.ADD}`,
            AuthMiddleware.authTokenOnly, AchievementRulesController.addAchievementRule);
    }
}

export default new AchievementRulesRoutes().achievementRulesRoutes;
