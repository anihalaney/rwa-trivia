
import * as express from 'express';
import { MigrationController } from '../controllers/migration.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { QuestionController } from '../controllers/question.controller';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';
export const migrationRoutes = express.Router();

class MigrationRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    private CL = GeneralConstants.COLON;
    private CLN = RoutesConstants.COLLECTION_NAME;
    private PROD = RoutesConstants.PROD;
    private DEV = RoutesConstants.DEV;

    public migrationRoutes: any;

    constructor() {

        this.migrationRoutes = express.Router();

        // migrate user stat to account stat
        //  '/account/stat'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.ACCOUNT}${this.FS}${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.migrateUserStatToAccounts);

        // generate account stat from all the games
        //  '/user/stat'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.USER}${this.FS}${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateUsersStat);

        // generate leaderboard stat from all the accounts
        //  '/leaderboard/stat'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.LEADERBOARD}${this.FS}${RoutesConstants.STAT}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateLeaderBoardStat);

        // generate user contribution stat from created questions
        //  '/user/contribution/stat'
        this.migrationRoutes
            .post(`${this.FS}${RoutesConstants.USER}${this.FS}${RoutesConstants.CONTRIBUTION}${this.FS}${RoutesConstants.STAT}`,
                AuthMiddleware.authTokenOnly, MigrationController.generateUserContributionStat);

        // update question category datatype from string to Number
        //  '/question/update'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.QUESTION}${this.FS}${RoutesConstants.UPDATE}`,
            AuthMiddleware.authTokenOnly, MigrationController.changeQuestionCategoryIdType);

        //  '/migrate/:collectionName'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.MIGRATE}${this.FS}${this.CL}${this.CLN}`,
            AuthMiddleware.authTokenOnly, MigrationController.migrateCollections);

        //  '/migrate/prod/dev/:collectionName'
        this.migrationRoutes
            .post(`${this.FS}${RoutesConstants.MIGRATE}${this.FS}${this.PROD}${this.FS}${this.DEV}${this.FS}${this.CL}${this.CLN}`,
                AuthMiddleware.authTokenOnly, MigrationController.migrateProdCollectionsToDev);

        //  '/rebuild/question/index'
        this.migrationRoutes
            .post(`${this.FS}${RoutesConstants.REBUILD}${this.FS}${RoutesConstants.QUESTION}${this.FS}${RoutesConstants.INDEX}`,
                AuthMiddleware.authTokenOnly, MigrationController.rebuildQuestionIndex);

        //  '/stat/system'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.STAT}${this.FS}${RoutesConstants.SYSTEM}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateSystemStat);

        //  '/bulkupload/update'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.BULK_UPLOAD}${this.FS}${RoutesConstants.UPDATE}`,
            AuthMiddleware.authTokenOnly, MigrationController.updateBulkUploadCollection);

        //  '/question/update/:collectionName'
        this.migrationRoutes
            .post(`${this.FS}${RoutesConstants.QUESTION}${this.FS}${RoutesConstants.UPDATE}${this.FS}${this.CL}${this.CLN}`,
                AuthMiddleware.authTokenOnly, MigrationController.updateQuestionCollection);

        //  '/auth-users'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.AUTH_DASH_USERS}`,
            AuthMiddleware.authTokenOnly, MigrationController.dumpAuthUsersInFirestore);

        //  '/user/profile/image'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.USER}${this.FS}${RoutesConstants.PROFILE}${this.FS}${RoutesConstants.IMAGE}`,
            AuthMiddleware.authTokenOnly, MigrationController.generateAllUsersProfileImages);

        //  '/question/status'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.QUESTION}${this.FS}${RoutesConstants.STATUS}`,
            AuthMiddleware.authTokenOnly, QuestionController.changeUnpublishedQuestionStatus);

        //  '/add/default/lives'
        this.migrationRoutes.post(`${this.FS}${RoutesConstants.ADD}${this.FS}${RoutesConstants.DEFAULT}${this.FS}${RoutesConstants.LIVES}`,
            AuthMiddleware.authTokenOnly, MigrationController.addDefaultLives);

        //  '/remove/social/profile'
        this.migrationRoutes
            .post(`${this.FS}${RoutesConstants.REMOVE}${this.FS}${RoutesConstants.SOCIAL}${this.FS}${RoutesConstants.PROFILE}`,
                AuthMiddleware.authTokenOnly, MigrationController.removeSocialProfile);

        //  '/update/all'
        this.migrationRoutes.get(`${this.FS}${RoutesConstants.UPDATE}${this.FS}${RoutesConstants.ALL}`,
            AuthMiddleware.adminOnly, MigrationController.updateAllGame);

    }
}

export default new MigrationRoutes().migrationRoutes;

