import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';


class GeneralRoutes {

    public generalRoutes: any;

    constructor() {

        this.generalRoutes = express.Router();

        //  '/hello'
        this.generalRoutes.get(`/${RoutesConstants.HELLO}`, AuthMiddleware.adminOnly, GeneralController.helloOperation);

        //  '/question'
        this.generalRoutes.get(`/${RoutesConstants.QUESTION}`, AuthMiddleware.adminOnly, GeneralController.getTestQuestion);

        //  '/game/question'
        this.generalRoutes.get(`/${RoutesConstants.GAME}/${RoutesConstants.QUESTION}`,
            AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);

        //  '/es/check'
        this.generalRoutes.get(`/${RoutesConstants.ES}/${RoutesConstants.CHECK}`,
            AuthMiddleware.adminOnly, GeneralController.testES);

        //  'updateAppVersion'
        this.generalRoutes.post(`/${RoutesConstants.UPDATE_APP_VERSION}`,
            AuthMiddleware.authTokenOnly, GeneralController.updateAppVersion);

        // `/getTopCategories` 
        this.generalRoutes.get(`/${RoutesConstants.TOP_CATEGORIES_COUNT}`,
            AuthMiddleware.authorizedOnly, GeneralController.getTopCategories);

        // `/getTopTags` 
        this.generalRoutes.get(`/${RoutesConstants.TOP_TAGS_COUNT}`,
            AuthMiddleware.authorizedOnly, GeneralController.getTopTags);

    }
}

export default new GeneralRoutes().generalRoutes;

