
import * as express from 'express';
import { GameController } from '../controllers/game.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class GameRoutes {

    private UID = RoutesConstants.USER_ID;
    private SID = RoutesConstants.SOCIAL_ID;
    public gameRoutes: any;

    constructor() {

        this.gameRoutes = express.Router();

        //  '/'
        this.gameRoutes.post('/', AuthMiddleware.authorizedOnly, GameController.createGame);

        //  '/:gameId'
        this.gameRoutes.put(`/:${RoutesConstants.GAME_ID}`,
            AuthMiddleware.authorizedOnly, GameController.updateGame);

        //  '/social/:userId/:socialId'
        this.gameRoutes.get(`/${RoutesConstants.SOCIAL}/:${this.UID}/:${this.SID}`,
            GameController.createSocialContent);

        //  '/social-image/:userId/:socialId'
        this.gameRoutes.get(`/${RoutesConstants.SOCIAL_DASH_IMAGE}/:${this.UID}/:${this.SID}`,
            GameController.createSocialImage);

    }
}

export default new GameRoutes().gameRoutes;

