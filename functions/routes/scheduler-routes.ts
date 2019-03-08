
import * as express from 'express';
import { SchedulerController } from '../controllers/scheduler.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class SchedulerRoutes {

    public schedulerRoutes: any;

    constructor() {

        this.schedulerRoutes = express.Router();

        //  '/game-over'
        this.schedulerRoutes.post(`/${RoutesConstants.GAME_DASH_OVER}`,
            AuthMiddleware.authTokenOnly, SchedulerController.checkGameOver);

        //  '/turn'
        this.schedulerRoutes.post(`/${RoutesConstants.TURN}`,
            AuthMiddleware.authTokenOnly, SchedulerController.changeGameTurn);

        //  '/add-lives'
        this.schedulerRoutes.post(`/${RoutesConstants.ADD_LIVES}`,
            AuthMiddleware.authTokenOnly, SchedulerController.addLives);

        //  '/blog'
        this.schedulerRoutes.post(`/${RoutesConstants.BLOG}`,
            AuthMiddleware.authTokenOnly, SchedulerController.generateBlogsData);

    }
}

export default new SchedulerRoutes().schedulerRoutes;
