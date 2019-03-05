import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware } from '../middlewares/auth';


class GeneralRoutes {

    public generalRoutes: any;

    constructor() {
        this.generalRoutes = express.Router();

        this.generalRoutes.get('/migrate/:collectionName', AuthMiddleware.adminOnly, GeneralController.migrateCollections);
        this.generalRoutes.get('/migrate/prod/dev/:collectionName',
            AuthMiddleware.adminOnly, GeneralController.migrateProdCollectionsToDev);
        this.generalRoutes.get('/rebuild/question/index', AuthMiddleware.adminOnly, GeneralController.rebuildQuestionIndex);
        this.generalRoutes.get('/hello', AuthMiddleware.adminOnly, GeneralController.helloOperation);
        this.generalRoutes.get('/question', AuthMiddleware.adminOnly, GeneralController.getTestQuestion);
        this.generalRoutes.get('/game/question', AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);
        this.generalRoutes.get('/es/check', AuthMiddleware.adminOnly, GeneralController.testES);
        this.generalRoutes.post('/stat/system', AuthMiddleware.adminOnly, GeneralController.generateSystemStat);
        this.generalRoutes.get('/bulkupload/update', AuthMiddleware.adminOnly, GeneralController.updateBulkUploadCollection);
        this.generalRoutes.post('/question/update/:collectionName', AuthMiddleware.adminOnly, GeneralController.updateQuestionCollection);
        this.generalRoutes.post('/blog', AuthMiddleware.authTokenOnly, GeneralController.generateBlogsData);
        this.generalRoutes.post('/auth-users', AuthMiddleware.authTokenOnly, GeneralController.dumpAuthUsersInFirestore);
        this.generalRoutes.post('/user/profile/image', AuthMiddleware.adminOnly, GeneralController.generateAllUsersProfileImages);
        this.generalRoutes.post('/question/status', AuthMiddleware.adminOnly, QuestionController.changeUnpublishedQuestionStatus);
        this.generalRoutes.get('/add/default/lives', AuthMiddleware.adminOnly, GeneralController.addDefaultLives);
        this.generalRoutes.get('/addLives', AuthMiddleware.adminOnly, GeneralController.addLives);
        this.generalRoutes.get('/remove/social/profile', AuthMiddleware.adminOnly, GeneralController.removeSocialProfile);
    }
}

export default new GeneralRoutes().generalRoutes;

