
import * as express from 'express';
import { MigrationController } from '../controllers/migration.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { QuestionController } from '../controllers/question.controller';
export const migrationRoutes = express.Router();

class MigrationRoutes {

    public migrationRoutes: any;

    constructor() {
        this.migrationRoutes = express.Router();

        // migrate user stat to account stat
        this.migrationRoutes.post('/account/stats', AuthMiddleware.authTokenOnly, MigrationController.migrateUserStatToAccounts);
        // generate account stat from all the games
        this.migrationRoutes.post('/user/stat', AuthMiddleware.authTokenOnly, MigrationController.generateUsersStat);
        // generate leaderboard stat from all the accounts
        this.migrationRoutes.post('/leaderboard/stat', AuthMiddleware.authTokenOnly, MigrationController.generateLeaderBoardStat);
        // generate user contribution stat from created questions
        this.migrationRoutes.post('/user/contribution/stat',
            AuthMiddleware.authTokenOnly, MigrationController.generateUserContributionStat);
        // update question category datatype from string to Number
        this.migrationRoutes.post('/question/update', AuthMiddleware.authTokenOnly, MigrationController.changeQuestionCategoryIdType);
        this.migrationRoutes.post('/migrate/:collectionName', AuthMiddleware.authTokenOnly, MigrationController.migrateCollections);
        this.migrationRoutes.post('/migrate/prod/dev/:collectionName',
            AuthMiddleware.authTokenOnly, MigrationController.migrateProdCollectionsToDev);
        this.migrationRoutes.post('/rebuild/question/index', AuthMiddleware.authTokenOnly, MigrationController.rebuildQuestionIndex);
        this.migrationRoutes.post('/stat/system', AuthMiddleware.authTokenOnly, MigrationController.generateSystemStat);
        this.migrationRoutes.post('/bulkupload/update', AuthMiddleware.authTokenOnly, MigrationController.updateBulkUploadCollection);
        this.migrationRoutes.post('/question/update/:collectionName',
            AuthMiddleware.authTokenOnly, MigrationController.updateQuestionCollection);
        this.migrationRoutes.post('/auth-users', AuthMiddleware.authTokenOnly, MigrationController.dumpAuthUsersInFirestore);
        this.migrationRoutes.post('/user/profile/image', AuthMiddleware.authTokenOnly, MigrationController.generateAllUsersProfileImages);
        this.migrationRoutes.post('/question/status', AuthMiddleware.authTokenOnly, QuestionController.changeUnpublishedQuestionStatus);
        this.migrationRoutes.post('/add/default/lives', AuthMiddleware.authTokenOnly, MigrationController.addDefaultLives);
        this.migrationRoutes.post('/remove/social/profile', AuthMiddleware.authTokenOnly, MigrationController.removeSocialProfile);
    }
}

export default new MigrationRoutes().migrationRoutes;

