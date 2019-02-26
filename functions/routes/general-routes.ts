import * as express from 'express';
const router = express.Router();

const generalAuth = require('../middlewares/auth');


const generalController = require('../controllers/general.controller');
const generalQuestionController = require('../controllers/question.controller');


router.get('/migrate/:collectionName', generalAuth.adminOnly, generalController.migrateCollections);
router.get('/migrate/prod/dev/:collectionName', generalAuth.adminOnly, generalController.migrateProdCollectionsToDev);
router.get('/rebuild/question/index', generalAuth.adminOnly, generalController.rebuildQuestionIndex);
router.get('/hello', generalAuth.adminOnly, generalController.helloOperation);
router.get('/question', generalAuth.adminOnly, generalController.getTestQuestion);
router.get('/game/question', generalAuth.adminOnly, generalController.getGameQuestionTest);
router.get('/es/check', generalAuth.adminOnly, generalController.testES);
router.get('/user/stat', generalAuth.adminOnly, generalController.generateUsersStat);
router.get('/leaderboard/stat', generalAuth.adminOnly, generalController.generateLeaderBoardStat);
router.get('/user/contribution/stat', generalAuth.adminOnly, generalController.generateUserContributionStat);
router.post('/stat/system', generalAuth.adminOnly, generalController.generateSystemStat);
router.get('/bulkupload/update', generalAuth.adminOnly, generalController.updateBulkUploadCollection);
router.post('/question/update/:collectionName', generalAuth.adminOnly, generalController.updateQuestionCollection);
router.post('/blog', generalAuth.authTokenOnly, generalController.generateBlogsData);
router.post('/auth-users', generalAuth.authTokenOnly, generalController.dumpAuthUsersInFirestore);
router.post('/user/profile/image', generalAuth.adminOnly, generalController.generateAllUsersProfileImages);
router.post('/question/status', generalAuth.adminOnly, generalQuestionController.changeUnpublishedQuestionStatus);
router.post('/migration/user/stats', generalAuth.adminOnly, generalController.migrateUserStatToAccounts);
router.get('/add/default/lives', generalAuth.adminOnly, generalController.addDefaultLives);
router.get('/addLives', generalAuth.adminOnly, generalController.addLives);
router.get('/remove/social/profile', generalAuth.adminOnly, generalController.removeSocialProfile);

module.exports = router;
