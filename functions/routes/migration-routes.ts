
import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
const migrationAuth = require('../middlewares/auth');
export const migrationRoutes = express.Router();


// migrate user stat to account stat
migrationRoutes.post('/account/stats', migrationAuth.authTokenOnly, GeneralController.migrateUserStatToAccounts);
// generate account stat from all the games
migrationRoutes.post('/user/stat', migrationAuth.authTokenOnly, GeneralController.generateUsersStat);
// generate leaderboard stat from all the accounts
migrationRoutes.post('/leaderboard/stat', migrationAuth.authTokenOnly, GeneralController.generateLeaderBoardStat);
// generate user contribution stat from created questions
migrationRoutes.post('/user/contribution/stat', migrationAuth.authTokenOnly, GeneralController.generateUserContributionStat);
// update question category datatype from string to Number
migrationRoutes.post('/question/update', migrationAuth.authTokenOnly, GeneralController.changeQuestionCategoryIdType);

