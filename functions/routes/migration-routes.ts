
import * as express from 'express';
import { MigrationController } from '../controllers/migration.controller';
import { AuthMiddleware} from '../middlewares/auth';
import { QuestionController } from '../controllers/question.controller';
export const migrationRoutes = express.Router();

// migrate user stat to account stat
migrationRoutes.post('/account/stats', AuthMiddleware.authTokenOnly, MigrationController.migrateUserStatToAccounts);
// generate account stat from all the games
migrationRoutes.post('/user/stat', AuthMiddleware.authTokenOnly, MigrationController.generateUsersStat);
// generate leaderboard stat from all the accounts
migrationRoutes.post('/leaderboard/stat', AuthMiddleware.authTokenOnly, MigrationController.generateLeaderBoardStat);
// generate user contribution stat from created questions
migrationRoutes.post('/user/contribution/stat', AuthMiddleware.authTokenOnly, MigrationController.generateUserContributionStat);
// update question category datatype from string to Number
migrationRoutes.post('/question/update', AuthMiddleware.authTokenOnly, MigrationController.changeQuestionCategoryIdType);

migrationRoutes.post('/migrate/:collectionName', AuthMiddleware.authTokenOnly, MigrationController.migrateCollections);
migrationRoutes.post('/migrate/prod/dev/:collectionName', AuthMiddleware.authTokenOnly, MigrationController.migrateProdCollectionsToDev);
migrationRoutes.post('/rebuild/question/index', AuthMiddleware.authTokenOnly, MigrationController.rebuildQuestionIndex);
migrationRoutes.post('/stat/system', AuthMiddleware.authTokenOnly, MigrationController.generateSystemStat);
migrationRoutes.post('/bulkupload/update', AuthMiddleware.authTokenOnly, MigrationController.updateBulkUploadCollection);
migrationRoutes.post('/question/update/:collectionName', AuthMiddleware.authTokenOnly, MigrationController.updateQuestionCollection);
migrationRoutes.post('/auth-users', AuthMiddleware.authTokenOnly, MigrationController.dumpAuthUsersInFirestore);
migrationRoutes.post('/user/profile/image', AuthMiddleware.authTokenOnly, MigrationController.generateAllUsersProfileImages);
migrationRoutes.post('/question/status', AuthMiddleware.authTokenOnly, QuestionController.changeUnpublishedQuestionStatus);
migrationRoutes.post('/add/default/lives', AuthMiddleware.authTokenOnly, MigrationController.addDefaultLives);
migrationRoutes.post('/addLives', AuthMiddleware.authTokenOnly, MigrationController.addLives);
migrationRoutes.post('/remove/social/profile', AuthMiddleware.authTokenOnly, MigrationController.removeSocialProfile);
