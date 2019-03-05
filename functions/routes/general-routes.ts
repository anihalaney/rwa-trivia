import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware } from '../middlewares/auth';


class GeneralRoutes {

    public generalRoutes: any;

    constructor() {
        this.generalRoutes = express.Router();

        this.generalRoutes.get('/hello', AuthMiddleware.adminOnly, GeneralController.helloOperation);
        this.generalRoutes.get('/question', AuthMiddleware.adminOnly, GeneralController.getTestQuestion);
        this.generalRoutes.get('/game/question', AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);
        this.generalRoutes.get('/es/check', AuthMiddleware.adminOnly, GeneralController.testES);
        this.generalRoutes.post('/blog', AuthMiddleware.authTokenOnly, GeneralController.generateBlogsData);
    }
}

export default new GeneralRoutes().generalRoutes;

