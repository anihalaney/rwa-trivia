
import * as express from 'express';
import { appConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
import friendRoutes from './friend-routes';
import gameRoutes from './game-routes';
import generalRoutes from './general-routes';
import migrationRoutes from './migration-routes';
import questionRoutes from './question-routes';
import schedulerRoutes from './scheduler-routes';
import subscriptionRoutes from './subscription-routes';
import userRoutes from './user-routes';
import achievementRulesRoutes from './achievement-rules-routes';

class Router {

    public router: any;

    constructor() {

        this.router = express.Router();

        //  '/question'
        this.router.use(`/${RoutesConstants.QUESTION}`, questionRoutes);

        //  '/subscription'
        this.router.use(`/${RoutesConstants.SUBSCRIPTION}`, subscriptionRoutes);

        //  '/game'
        this.router.use(`/${RoutesConstants.GAME}`, gameRoutes);

        //  '/general'
        this.router.use(`/${RoutesConstants.GENERAL}`, generalRoutes);

        //  '/migration'
        this.router.use(`/${RoutesConstants.MIGRATION}`, migrationRoutes);

        //  '/scheduler'
        this.router.use(`/${RoutesConstants.SCHEDULER}`, schedulerRoutes);

        //  '/friend'
        this.router.use(`/${RoutesConstants.FRIEND}`, friendRoutes);

        //  '/user'
        this.router.use(`/${RoutesConstants.USER}`, userRoutes);

        //  '/achievement'
        this.router.use(`/${RoutesConstants.ACHIEVEMENT}`, achievementRulesRoutes);
    }
}

export default new Router().router;
