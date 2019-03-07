import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';


class GeneralRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    public generalRoutes: any;

    constructor() {

        this.generalRoutes = express.Router();

        //  '/hello'
        this.generalRoutes.get(`${this.FS}${RoutesConstants.HELLO}`, AuthMiddleware.adminOnly, GeneralController.helloOperation);

        //  '/question'
        this.generalRoutes.get(`${this.FS}${RoutesConstants.QUESTION}`, AuthMiddleware.adminOnly, GeneralController.getTestQuestion);

        //  '/game/question'
        this.generalRoutes.get(`${this.FS}${RoutesConstants.GAME}${this.FS}${RoutesConstants.QUESTION}`,
            AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);

        //  '/es/check'
        this.generalRoutes.get(`${this.FS}${RoutesConstants.ES}${this.FS}${RoutesConstants.CHECK}`,
            AuthMiddleware.adminOnly, GeneralController.testES);

    }
}

export default new GeneralRoutes().generalRoutes;

