import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware} from '../middlewares/auth';
export const generalRoutes = express.Router();



generalRoutes.get('/hello', AuthMiddleware.adminOnly, GeneralController.helloOperation);
generalRoutes.get('/question', AuthMiddleware.adminOnly, GeneralController.getTestQuestion);
generalRoutes.get('/game/question', AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);
generalRoutes.get('/es/check', AuthMiddleware.adminOnly, GeneralController.testES);
generalRoutes.post('/blog', AuthMiddleware.authTokenOnly, GeneralController.generateBlogsData);
