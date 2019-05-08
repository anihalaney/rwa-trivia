
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

        //  '/app/question'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.QUESTION}`, questionRoutes);

        //  '/app/subscription'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.SUBSCRIPTION}`, subscriptionRoutes);

        //  '/app/game'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.GAME}`, gameRoutes);

        //  '/app/general'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.GENERAL}`, generalRoutes);

        //  '/app/migration'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.MIGRATION}`, migrationRoutes);

        //  '/app/scheduler'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.SCHEDULER}`, schedulerRoutes);

        //  '/app/friend'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.FRIEND}`, friendRoutes);

        //  '/app/user'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.USER}`, userRoutes);

        //  '/app/achievement'
        this.router.use(`/${appConstants.API_PREFIX}/${RoutesConstants.ACHIEVEMENT}`, achievementRulesRoutes);
    }
}

export default new Router().router;
