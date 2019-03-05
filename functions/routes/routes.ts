
import { appConstants } from '../../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import questionRoutes from './question-routes';
import subscriptionRoutes from './subscription-routes';
import generalRoutes from './general-routes';
import migrationRoutes from './migration-routes';
import schedulerRoutes from './migration-routes';
import friendRoutes from './friend-routes';
import gameRoutes from './game-routes';
import userRoutes from './user-routes';

class Router {

    public router: any;

    constructor() {
        this.router = express.Router();
        this.router.use(`/${appConstants.API_PREFIX}/question`, questionRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/subscription`, subscriptionRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/game`, gameRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/general`, generalRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/migration`, migrationRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/scheduler`, schedulerRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/friend`, friendRoutes);
        this.router.use(`/${appConstants.API_PREFIX}/user`, userRoutes);
    }
}

export default new Router().router;
