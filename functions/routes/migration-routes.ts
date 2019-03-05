
import * as express from 'express';
import { GeneralController } from '../controllers/general.controller';
import { AuthMiddleware} from "../middlewares/auth";
export const migrationRoutes = express.Router();


// migrate user stat to account stat
migrationRoutes.post('/account/stats', AuthMiddleware.authTokenOnly, GeneralController.migrateUserStatToAccounts);
// generate account stat from all the games
migrationRoutes.post('/user/stat', AuthMiddleware.authTokenOnly, GeneralController.generateUsersStat);
// generate leaderboard stat from all the accounts
migrationRoutes.post('/leaderboard/stat', AuthMiddleware.authTokenOnly, GeneralController.generateLeaderBoardStat);
// generate user contribution stat from created questions
migrationRoutes.post('/user/contribution/stat', AuthMiddleware.authTokenOnly, GeneralController.generateUserContributionStat);
// update question category datatype from string to Number
migrationRoutes.post('/question/update', AuthMiddleware.authTokenOnly, GeneralController.changeQuestionCategoryIdType);

