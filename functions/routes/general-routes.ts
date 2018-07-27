
express = require('express'),
    router = express.Router();

const generalAuth = require('../middlewares/auth');


const generalController = require('../controllers/general.controller');


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

module.exports = router;
