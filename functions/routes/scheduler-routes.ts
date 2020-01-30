
import * as express from 'express';
import { SchedulerController } from '../controllers/scheduler.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class SchedulerRoutes {

    public schedulerRoutes: any;

    constructor() {

        this.schedulerRoutes = express.Router();

        //  '/check-game-expired-and-set-game-over'
        this.schedulerRoutes.post(`/${RoutesConstants.CHECK_DASH_GAME_DASH_EXPIRED_DASH_AND_DASH_SET_DASH_GAME_DASH_OVER}`,
            AuthMiddleware.authTokenOnly, SchedulerController.checkGameExpiredAndSetGameOver);

        //  '/turn'
        this.schedulerRoutes.post(`/${RoutesConstants.TURN}`,
            AuthMiddleware.authTokenOnly, SchedulerController.changeGameTurn);

        //  '/add-lives'
        this.schedulerRoutes.post(`/${RoutesConstants.ADD_LIVES}`,
            AuthMiddleware.authTokenOnly, SchedulerController.addLives);

        //  '/blog'
        this.schedulerRoutes.post(`/${RoutesConstants.BLOG}`,
            AuthMiddleware.authTokenOnly, SchedulerController.generateBlogsData);

        // game-time-reminder-notification
        this.schedulerRoutes.post(
        `/${RoutesConstants.GAME_DASH_TIME_DASH_REMINDER_NOTIFICATION}/:${RoutesConstants.REMINDER_DASH_BEFORE_DASH_TIME}`,
        AuthMiddleware.authTokenOnly, SchedulerController.gameTimeReminderNotification);

        //  '/no-game-play-32days'
        this.schedulerRoutes.post(`/${RoutesConstants.NO_DASH_GAME_DASH_PLAY_DASH_32DAYS}`,
        AuthMiddleware.authTokenOnly, SchedulerController.noGamePlayFor32Days);

        //  '/game-invitation-expire'
        this.schedulerRoutes.post(`/${RoutesConstants.GAME_DASH_INVITATION_DASH_EXPIRE}`,
        AuthMiddleware.authTokenOnly, SchedulerController.checkGameInvitationIsExpired);

    }
}

export default new SchedulerRoutes().schedulerRoutes;
