
import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class UserRoutes {

    private UID = RoutesConstants.USER_ID;

    public userRoutes: any;

    constructor() {
        this.userRoutes = express.Router();

        //  '/:userId'
        this.userRoutes.get(`/:${this.UID}`,
            UserController.getUserById);

        //  '/profile/:userId/:imageName/:width/:height'
        this.userRoutes.get(
            `/${RoutesConstants.PROFILE}/:${this.UID}/:${RoutesConstants.IMAGE_NAME}/:${RoutesConstants.WIDTH}/:${RoutesConstants.HEIGHT}`,
            UserController.getUserImages);

        //  '/profile'
        this.userRoutes.post(`/${RoutesConstants.PROFILE}`,
            AuthMiddleware.authorizedOnly, UserController.generateUserProfileImage);

        //  '/update-lives'
        this.userRoutes.post(`/${RoutesConstants.UPDATE_DASH_LIVES}`,
            AuthMiddleware.authorizedOnly, UserController.updateLives);

        //  'extendedInfo/:userId/:loginUserId'
        this.userRoutes.get(`/${RoutesConstants.EXTENDEDINFO}/:${this.UID}`,
        UserController.getUserProfileById);

    }
}

export default new UserRoutes().userRoutes;

