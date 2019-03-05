
import * as express from 'express';
import { SchedulerController } from '../controllers/scheduler.controller';
import { AuthMiddleware} from '../middlewares/auth';

class SchedulerRoutes {

    public schedulerRoutes: any;

    constructor() {
        this.schedulerRoutes = express.Router();
        this.schedulerRoutes.post('/game-over/scheduler', AuthMiddleware.authTokenOnly, SchedulerController.checkGameOver);
        this.schedulerRoutes.post('/turn/scheduler', AuthMiddleware.authTokenOnly, SchedulerController.changeGameTurn);
        this.schedulerRoutes.post('/addLives', AuthMiddleware.authTokenOnly, SchedulerController.addLives);

    }
}

export default new SchedulerRoutes().schedulerRoutes;
