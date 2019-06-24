
import * as express from 'express';
import { MigrationController } from '../controllers/migration.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { QuestionController } from '../controllers/question.controller';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
export const migrationRoutes = express.Router();

class MigrationRoutes {

    private CLN = RoutesConstants.COLLECTION_NAME;
    private PROD = RoutesConstants.PROD;
    private DEV = RoutesConstants.DEV;

    public migrationRoutes: any;

    constructor() {

        this.migrationRoutes = express.Router();

        // migrate user stat to account stat
        //  '/account/stat'
        this.migrationRoutes.post(`/${RoutesConstants.ACCOUNT}/${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.migrateUserStatToAccounts);

        // generate account stat from all the games
        //  '/user/stat'
        this.migrationRoutes.post(`/${RoutesConstants.USER}/${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateUsersStat);

        // generate leaderboard stat from all the accounts
        //  '/leaderboard/stat'
        this.migrationRoutes.post(`/${RoutesConstants.LEADERBOARD}/${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateLeaderBoardStat);

        // generate user contribution stat from created questions
        //  '/user/contribution/stat'
        this.migrationRoutes
            .post(`/${RoutesConstants.USER}/${RoutesConstants.CONTRIBUTION}/${RoutesConstants.STAT}`,
                AuthMiddleware.authTokenOnly, MigrationController.generateUserContributionStat);

        // update question category datatype from string to Number
        //  '/question/update'
        this.migrationRoutes.post(`/${RoutesConstants.QUESTION}/${RoutesConstants.UPDATE}`,
            AuthMiddleware.authTokenOnly, MigrationController.changeQuestionCategoryIdType);

        //  '/migrate/:collectionName'
        this.migrationRoutes.post(`/${RoutesConstants.MIGRATE}/:${this.CLN}`,
            AuthMiddleware.authTokenOnly, MigrationController.migrateCollections);

        //  '/migrate/prod/dev/:collectionName'
        this.migrationRoutes
            .post(`/${RoutesConstants.MIGRATE}/${this.PROD}/${this.DEV}/:${this.CLN}`,
                AuthMiddleware.authTokenOnly, MigrationController.migrateProdCollectionsToDev);

        //  '/rebuild/question/index'
        this.migrationRoutes
            .post(`/${RoutesConstants.REBUILD}/${RoutesConstants.QUESTION}/${RoutesConstants.INDEX}`,
                AuthMiddleware.authTokenOnly, MigrationController.rebuildQuestionIndex);

        //  '/stat/system'
        this.migrationRoutes.post(`/${RoutesConstants.STAT}/${RoutesConstants.SYSTEM}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateSystemStat);

        //  '/bulkupload/update'
        this.migrationRoutes.post(`/${RoutesConstants.BULK_UPLOAD}/${RoutesConstants.UPDATE}`,
            AuthMiddleware.authTokenOnly, MigrationController.updateBulkUploadCollection);

        //  '/question/update/:collectionName'
        this.migrationRoutes
            .post(`/${RoutesConstants.QUESTION}/${RoutesConstants.UPDATE}/:${this.CLN}`,
                AuthMiddleware.authTokenOnly, MigrationController.updateQuestionCollection);

        //  '/auth-users'
        this.migrationRoutes.post(`/${RoutesConstants.AUTH_DASH_USERS}`,
            AuthMiddleware.authTokenOnly, MigrationController.dumpAuthUsersInFirestore);

        //  '/user/profile/image'
        this.migrationRoutes.post(`/${RoutesConstants.USER}/${RoutesConstants.PROFILE}/${RoutesConstants.IMAGE}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateAllUsersProfileImages);

        //  '/question/status'
        this.migrationRoutes.post(`/${RoutesConstants.QUESTION}/${RoutesConstants.STATUS}`,
            AuthMiddleware.authTokenOnly, QuestionController.changeUnpublishedQuestionStatus);

        //  '/add/default/lives'
        this.migrationRoutes.post(`/${RoutesConstants.ADD}/${RoutesConstants.DEFAULT}/${RoutesConstants.LIVES}`,
            AuthMiddleware.authTokenOnly, MigrationController.addDefaultLives);

        //  '/remove/social/profile'
        this.migrationRoutes
            .post(`/${RoutesConstants.REMOVE}/${RoutesConstants.SOCIAL}/${RoutesConstants.PROFILE}`,
                AuthMiddleware.authTokenOnly, MigrationController.removeSocialProfile);

        //  '/update/all'
        this.migrationRoutes.get(`/${RoutesConstants.UPDATE}/${RoutesConstants.ALL}`,
            AuthMiddleware.adminOnly, MigrationController.updateAllGame);

        //  '/update/add/gameoverat'
        this.migrationRoutes.get(`/${RoutesConstants.UPDATE}/${RoutesConstants.ADD}/${RoutesConstants.GAMEOVERAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.addGameOverAtField);

        //  '/remove/accounts'
        this.migrationRoutes.post(`/${RoutesConstants.REMOVE}/${RoutesConstants.ACCOUNTS}`,
            AuthMiddleware.authTokenOnly, MigrationController.removeAllAccounts);

        //  '/user/updateusergameplayedwithstat'
        this.migrationRoutes.post(`/${RoutesConstants.USER}/${RoutesConstants.UPDATE_USER_GAME_PLAYED_WITH_STAT}`,
        AuthMiddleware.authTokenOnly, MigrationController.updateUserGamePlayedWithStat);

    }
}

export default new MigrationRoutes().migrationRoutes;

