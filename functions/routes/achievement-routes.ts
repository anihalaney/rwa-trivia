import * as express from 'express';
import { RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
import { AchievementController } from '../controllers/achievement.controller';
import { AuthMiddleware } from '../middlewares/auth';

class AchievementRoutes {

    public achievementRoutes: any;

    constructor() {

        this.achievementRoutes = express.Router();

        //  '/add'
        this.achievementRoutes.post(`/${RoutesConstants.ADD}`, AuthMiddleware.authTokenOnly, AchievementController.addAchievement);
    }
}

export default new AchievementRoutes().achievementRoutes;
