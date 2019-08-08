
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

        //  '/check/display-name/:displayName'
        this.userRoutes.get(
            `/${RoutesConstants.CHECK}/${RoutesConstants.DISPLAY_NAME}/:${RoutesConstants.DISPLAY_DASH_NAME}`,
            AuthMiddleware.authorizedOnly, UserController.checkDisplayName);

        // `/addressSuggestion/:location`
        this.userRoutes.get(`/${RoutesConstants.ADDRESS_SUGGESTION}/:${RoutesConstants.LOCATION}`,
            AuthMiddleware.authorizedOnly, UserController.addressSuggestion);

        // `/addressByLatLang/:latLong`
        this.userRoutes.get(`/${RoutesConstants.ADDRESS_BY_LAT_LANG}/:${RoutesConstants.LAT_LONG}`,
            AuthMiddleware.authorizedOnly, UserController.addressByLatLang);

        //  '/add-bits-first-question'
        this.userRoutes.post(`/${RoutesConstants.ADD_BITES_FIRST_QUESTION}`,
            AuthMiddleware.authorizedOnly, UserController.addBitesFirstQuestion);


    }
}

export default new UserRoutes().userRoutes;

