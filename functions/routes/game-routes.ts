
import * as express from 'express';
import { GameController } from '../controllers/game.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class GameRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    private CL = GeneralConstants.COLON;
    private UID = RoutesConstants.USER_ID;
    private SID = RoutesConstants.SOCIAL_ID;
    public gameRoutes: any;

    constructor() {

        this.gameRoutes = express.Router();

        //  '/'
        this.gameRoutes.post(this.FS, AuthMiddleware.authorizedOnly, GameController.createGame);

        //  '/:gameId'
        this.gameRoutes.put(`${this.FS}${this.CL}${RoutesConstants.GAME_ID}`,
            AuthMiddleware.authorizedOnly, GameController.updateGame);

        //  '/social/:userId/:socialId'
        this.gameRoutes.get(`${this.FS}${RoutesConstants.SOCIAL}${this.FS}${this.CL}${this.UID}${this.FS}${this.CL}${this.SID}`,
            GameController.createSocialContent);

        //  '/social-image/:userId/:socialId'
        this.gameRoutes.get(`${this.FS}${RoutesConstants.SOCIAL_DASH_IMAGE}${this.FS}${this.CL}${this.UID}${this.FS}${this.CL}${this.SID}`,
            GameController.createSocialImage);

    }
}

export default new GameRoutes().gameRoutes;

