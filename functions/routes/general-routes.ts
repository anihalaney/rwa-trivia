import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware} from "../middlewares/auth";
export const generalRoutes = express.Router();


generalRoutes.get('/migrate/:collectionName', AuthMiddleware.adminOnly, GeneralController.migrateCollections);
generalRoutes.get('/migrate/prod/dev/:collectionName', AuthMiddleware.adminOnly, GeneralController.migrateProdCollectionsToDev);
generalRoutes.get('/rebuild/question/index', AuthMiddleware.adminOnly, GeneralController.rebuildQuestionIndex);
generalRoutes.get('/hello', AuthMiddleware.adminOnly, GeneralController.helloOperation);
generalRoutes.get('/question', AuthMiddleware.adminOnly, GeneralController.getTestQuestion);
generalRoutes.get('/game/question', AuthMiddleware.adminOnly, GeneralController.getGameQuestionTest);
generalRoutes.get('/es/check', AuthMiddleware.adminOnly, GeneralController.testES);
generalRoutes.post('/stat/system', AuthMiddleware.adminOnly, GeneralController.generateSystemStat);
generalRoutes.get('/bulkupload/update', AuthMiddleware.adminOnly, GeneralController.updateBulkUploadCollection);
generalRoutes.post('/question/update/:collectionName', AuthMiddleware.adminOnly, GeneralController.updateQuestionCollection);
generalRoutes.post('/blog', AuthMiddleware.authTokenOnly, GeneralController.generateBlogsData);
generalRoutes.post('/auth-users', AuthMiddleware.authTokenOnly, GeneralController.dumpAuthUsersInFirestore);
generalRoutes.post('/user/profile/image', AuthMiddleware.adminOnly, GeneralController.generateAllUsersProfileImages);
generalRoutes.post('/question/status', AuthMiddleware.adminOnly, QuestionController.changeUnpublishedQuestionStatus);
generalRoutes.get('/add/default/lives', AuthMiddleware.adminOnly, GeneralController.addDefaultLives);
generalRoutes.get('/addLives', AuthMiddleware.adminOnly, GeneralController.addLives);
generalRoutes.get('/remove/social/profile', AuthMiddleware.adminOnly, GeneralController.removeSocialProfile);
