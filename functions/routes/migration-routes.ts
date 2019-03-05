
import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware } from '../middlewares/auth';
export const migrationRoutes = express.Router();

class MigrationRoutes {

    public migrationRoutes: any;

    constructor() {
        this.migrationRoutes = express.Router();

        // migrate user stat to account stat
        this.migrationRoutes.post('/account/stats', AuthMiddleware.authTokenOnly, GeneralController.migrateUserStatToAccounts);
        // generate account stat from all the games
        this.migrationRoutes.post('/user/stat', AuthMiddleware.authTokenOnly, GeneralController.generateUsersStat);
        // generate leaderboard stat from all the accounts
        this.migrationRoutes.post('/leaderboard/stat', AuthMiddleware.authTokenOnly, GeneralController.generateLeaderBoardStat);
        // generate user contribution stat from created questions
        this.migrationRoutes.post('/user/contribution/stat', AuthMiddleware.authTokenOnly, GeneralController.generateUserContributionStat);
        // update question category datatype from string to Number
        this.migrationRoutes.post('/question/update', AuthMiddleware.authTokenOnly, GeneralController.changeQuestionCategoryIdType);
    }
}

export default new MigrationRoutes().migrationRoutes;

