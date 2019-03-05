
import * as express from 'express';
import { SchedulerController } from '../controllers/scheduler.controller';
import { AuthMiddleware} from '../middlewares/auth';
export const schedulerRoutes = express.Router();

schedulerRoutes.post('/game-over/scheduler', AuthMiddleware.authTokenOnly, SchedulerController.checkGameOver);
schedulerRoutes.post('/turn/scheduler', AuthMiddleware.authTokenOnly, SchedulerController.changeGameTurn);
