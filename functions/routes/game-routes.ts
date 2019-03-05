
import * as express from 'express';
import { GameController } from '../controllers/game.controller';
import { AuthMiddleware } from '../middlewares/auth';

class GameRoutes {

    public gameRoutes: any;

    constructor() {
        this.gameRoutes = express.Router();

        this.gameRoutes.post('/', AuthMiddleware.authorizedOnly, GameController.createGame);
        this.gameRoutes.put('/:gameId', AuthMiddleware.authorizedOnly, GameController.updateGame);
        this.gameRoutes.post('/game-over/scheduler', AuthMiddleware.authTokenOnly, GameController.checkGameOver);
        this.gameRoutes.get('/update/all', AuthMiddleware.adminOnly, GameController.updateAllGame);
        this.gameRoutes.post('/turn/scheduler', AuthMiddleware.authTokenOnly, GameController.changeGameTurn);
        this.gameRoutes.get('/social/:userId/:socialId', GameController.createSocialContent);
        this.gameRoutes.get('/social-image/:userId/:socialId', GameController.createSocialImage);
    }
}

export default new GameRoutes().gameRoutes;

