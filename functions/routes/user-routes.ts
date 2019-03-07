
import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class UserRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    private CL = GeneralConstants.COLON;
    private UID = RoutesConstants.USER_ID;

    public userRoutes: any;

    constructor() {
        this.userRoutes = express.Router();

        //  '/:userId'
        this.userRoutes.get(`${this.FS}${this.CL}${this.UID}`,
            UserController.getUserById);

        //  '/profile/:userId/:imageName/:width/:height'
        this.userRoutes.get(`${this.FS}${RoutesConstants.PROFILE}${this.FS}${this.CL}${this.UID}${this.FS}${this.CL}${RoutesConstants.IMAGE_NAME}${this.FS}${this.CL}${RoutesConstants.WIDTH}${this.FS}${this.CL}${RoutesConstants.HEIGHT}`,
            UserController.getUserImages);

        //  '/profile'
        this.userRoutes.post(`${this.FS}${RoutesConstants.PROFILE}`,
            AuthMiddleware.authorizedOnly, UserController.generateUserProfileImage);

        //  '/update-lives'
        this.userRoutes.post(`${this.FS}${RoutesConstants.UPDATE_DASH_LIVES}`,
            AuthMiddleware.authorizedOnly, UserController.updateLives);

    }
}

export default new UserRoutes().userRoutes;

