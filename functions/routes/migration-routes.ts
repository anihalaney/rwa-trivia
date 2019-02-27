
import * as express from 'express';
const router = express.Router();

const migrationAuth = require('../middlewares/auth');

const migrationController = require('../controllers/general.controller');

// migrate user stat to account stat
router.post('/account/stats', migrationAuth.authTokenOnly, migrationController.migrateUserStatToAccounts);
// generate account stat from all the games
router.post('/user/stat', migrationAuth.authTokenOnly, migrationController.generateUsersStat);
// generate leaderboard stat from all the accounts
router.post('/leaderboard/stat', migrationAuth.authTokenOnly, migrationController.generateLeaderBoardStat);
// generate user contribution stat from created questions
router.post('/user/contribution/stat', migrationAuth.authTokenOnly, migrationController.generateUserContributionStat);
// update question category datatype from string to Number
router.post('/question/update', migrationAuth.authTokenOnly, migrationController.changeQuestionCategoryIdType);


module.exports = router;
