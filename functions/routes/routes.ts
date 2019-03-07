
import { appConstants, GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import questionRoutes from './question-routes';
import subscriptionRoutes from './subscription-routes';
import generalRoutes from './general-routes';
import migrationRoutes from './migration-routes';
import schedulerRoutes from './scheduler-routes';
import friendRoutes from './friend-routes';
import gameRoutes from './game-routes';
import userRoutes from './user-routes';

class Router {
    private FS = GeneralConstants.FORWARD_SLASH;
    public router: any;

    constructor() {

        this.router = express.Router();

        //  '/app/question'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.QUESTION}`, questionRoutes);

        //  '/app/subscription'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.SUBSCRIPTION}`, subscriptionRoutes);

        //  '/app/game'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.GAME}`, gameRoutes);

        //  '/app/general'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.GENERAL}`, generalRoutes);

        //  '/app/migration'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.MIGRATION}`, migrationRoutes);

        //  '/app/scheduler'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.SCHEDULER}`, schedulerRoutes);

        //  '/app/friend'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.FRIEND}`, friendRoutes);

        //  '/app/user'
        this.router.use(`${this.FS}${appConstants.API_PREFIX}${this.FS}${RoutesConstants.USER}`, userRoutes);

    }
}

export default new Router().router;
