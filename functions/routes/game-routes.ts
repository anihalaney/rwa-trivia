
express = require('express'),
    router = express.Router();

const gameAuth = require('../middlewares/auth');

const gameController = require('../controllers/game.controller');


router.post('/', gameAuth.authorizedOnly, gameController.createGame);
router.put('/:gameId', gameAuth.authorizedOnly, gameController.updateGame);
router.post('/game-over/scheduler', gameAuth.authTokenOnly, gameController.checkGameOver);
router.get('/update/all', gameAuth.adminOnly, gameController.updateAllGame);
router.post('/turn/scheduler', gameAuth.authTokenOnly, gameController.changeGameTurn);
router.get('/social/:userId/:socialId', gameController.createSocialContent);
router.get('/social-image/:userId/:socialId', gameController.createSocialImage);
module.exports = router;
