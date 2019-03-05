
import * as express from 'express';
import { GameController } from '../controllers/game.controller';
import { AuthMiddleware} from '../middlewares/auth';
export const gameRoutes = express.Router();

gameRoutes.post('/', AuthMiddleware.authorizedOnly, GameController.createGame);
gameRoutes.put('/:gameId', AuthMiddleware.authorizedOnly, GameController.updateGame);
gameRoutes.get('/update/all', AuthMiddleware.adminOnly, GameController.updateAllGame);
gameRoutes.get('/social/:userId/:socialId', GameController.createSocialContent);
gameRoutes.get('/social-image/:userId/:socialId', GameController.createSocialImage);

