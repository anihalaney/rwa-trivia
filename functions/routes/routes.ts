
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

        //  '/app/v1/question'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.QUESTION}`, questionRoutes);

        //  '/app/v1/subscription'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.SUBSCRIPTION}`, subscriptionRoutes);

        //  '/app/v1/game'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.GAME}`, gameRoutes);

        //  '/app/v1/general'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.GENERAL}`, generalRoutes);

        //  '/app/v1/migration'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.MIGRATION}`, migrationRoutes);

        //  '/app/v1/scheduler'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.SCHEDULER}`, schedulerRoutes);

        //  '/app/v1/friend'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.FRIEND}`, friendRoutes);

        //  '/app/v1/user'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.USER}`, userRoutes);

        //  '/app/v1/achievement'
        this.router.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}/${RoutesConstants.ACHIEVEMENT}`, achievementRulesRoutes);
    }
}

export default new Router().router;
