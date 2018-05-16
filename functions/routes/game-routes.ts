
express = require('express'),
    router = express.Router();

const gameAuth = require('../middlewares/auth');

const gameController = require('../controllers/game.controller');


router.post('/', gameAuth.authorizedOnly, gameController.createGame);
router.put('/:gameId', gameAuth.authorizedOnly, gameController.updateGame);
router.post('/scheduler', gameAuth.authTokenOnly, gameController.checkGameOver);
router.get('/update/all', gameAuth.adminOnly, gameController.updateAllGame);

module.exports = router;
