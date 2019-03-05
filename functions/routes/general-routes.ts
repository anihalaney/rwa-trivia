import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { GeneralController } from '../controllers/general.controller';
const generalAuth = require('../middlewares/auth');
export const generalRoutes = express.Router();


generalRoutes.get('/migrate/:collectionName', generalAuth.adminOnly, GeneralController.migrateCollections);
generalRoutes.get('/migrate/prod/dev/:collectionName', generalAuth.adminOnly, GeneralController.migrateProdCollectionsToDev);
generalRoutes.get('/rebuild/question/index', generalAuth.adminOnly, GeneralController.rebuildQuestionIndex);
generalRoutes.get('/hello', generalAuth.adminOnly, GeneralController.helloOperation);
generalRoutes.get('/question', generalAuth.adminOnly, GeneralController.getTestQuestion);
generalRoutes.get('/game/question', generalAuth.adminOnly, GeneralController.getGameQuestionTest);
generalRoutes.get('/es/check', generalAuth.adminOnly, GeneralController.testES);
generalRoutes.post('/stat/system', generalAuth.adminOnly, GeneralController.generateSystemStat);
generalRoutes.get('/bulkupload/update', generalAuth.adminOnly, GeneralController.updateBulkUploadCollection);
generalRoutes.post('/question/update/:collectionName', generalAuth.adminOnly, GeneralController.updateQuestionCollection);
generalRoutes.post('/blog', generalAuth.authTokenOnly, GeneralController.generateBlogsData);
generalRoutes.post('/auth-users', generalAuth.authTokenOnly, GeneralController.dumpAuthUsersInFirestore);
generalRoutes.post('/user/profile/image', generalAuth.adminOnly, GeneralController.generateAllUsersProfileImages);
generalRoutes.post('/question/status', generalAuth.adminOnly, QuestionController.changeUnpublishedQuestionStatus);
generalRoutes.get('/add/default/lives', generalAuth.adminOnly, GeneralController.addDefaultLives);
generalRoutes.get('/addLives', generalAuth.adminOnly, GeneralController.addLives);
generalRoutes.get('/remove/social/profile', generalAuth.adminOnly, GeneralController.removeSocialProfile);
