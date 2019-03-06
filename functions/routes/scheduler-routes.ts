
import * as express from 'express';
import { SchedulerController } from '../controllers/scheduler.controller';
import { AuthMiddleware} from '../middlewares/auth';

class SchedulerRoutes {

    public schedulerRoutes: any;

    constructor() {
        this.schedulerRoutes = express.Router();
        this.schedulerRoutes.post('/game-over', AuthMiddleware.authTokenOnly, SchedulerController.checkGameOver);
        this.schedulerRoutes.post('/turn', AuthMiddleware.authTokenOnly, SchedulerController.changeGameTurn);
        this.schedulerRoutes.post('/addLives', AuthMiddleware.authTokenOnly, SchedulerController.addLives);
        this.schedulerRoutes.post('/blog', AuthMiddleware.authTokenOnly, SchedulerController.generateBlogsData);
    }
}

export default new SchedulerRoutes().schedulerRoutes;
